#!/usr/bin/env python3
"""
ElevenLabs Text-to-Speech Player for Mac

Simple script to convert text to speech and play it using macOS's built-in afplay.

Usage:
    python3 elevenlabs_speak.py "Text to speak"
    python3 elevenlabs_speak.py "Text to speak" --api-key YOUR_KEY
    python3 elevenlabs_speak.py "Text to speak" --env-file .secrets/.env
"""

import argparse
import json
import os
import signal
import subprocess
import sys
import tempfile
from typing import Optional
import urllib.request
from pathlib import Path

# Alice (female, British) - premade
DEFAULT_VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2"
# Lily (female, neutral accent) - premade, works immediately
# DEFAULT_VOICE_ID = "pFZP5JQG7iQjIQuC4Bku"
# Roshni (female, British, neutral accent) - Voice Library, requires adding to account first.
# DEFAULT_VOICE_ID = "fq1SdXsX6OokE10pJ4Xw"


def load_env_file(env_file: str) -> None:
    """Load environment variables from a .env file."""
    env_path = Path(env_file)
    if not env_path.exists():
        raise FileNotFoundError(f"Environment file not found: {env_file}")

    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                # Only load the specific key we expect for this script
                if key.strip() == "ELEVENLABS_API_KEY":
                    # Remove quotes if present
                    value = value.strip().strip('"').strip("'")
                    os.environ["ELEVENLABS_API_KEY"] = value


def get_api_key(api_key_arg: Optional[str] = None) -> str:
    """Get ElevenLabs API key from argument or environment."""
    if api_key_arg:
        return api_key_arg

    api_key = os.environ.get("ELEVENLABS_API_KEY")
    if not api_key:
        raise ValueError(
            "ElevenLabs API key not found. Provide --api-key or --env-file, "
            "or set ELEVENLABS_API_KEY environment variable."
        )
    return api_key


def text_to_speech(text: str, api_key: str) -> str:
    """Convert text to speech and save to temp file."""
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{DEFAULT_VOICE_ID}/stream"

    data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.5},
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": api_key,
        },
    )

    # Create temp file
    fd, audio_path = tempfile.mkstemp(suffix=".mp3", prefix="elevenlabs_")
    os.close(fd)

    # Download audio
    with urllib.request.urlopen(req) as response:
        with open(audio_path, "wb") as f:
            f.write(response.read())

    return audio_path


def play_audio(audio_path: str) -> None:
    """
    Play audio file using macOS's afplay.

    This is more copmlicated than just subprocess.run, because we
    wanted to be able to cancel the audio playback if someone hits
    Cancel in the Cursor UI. But unfortunately this is still not cancelling...
    """
    # Start the audio player process
    process = subprocess.Popen(["afplay", audio_path])

    def signal_handler(sig, frame):
        """Kill the audio process when interrupted."""
        if process.poll() is None:  # If process is still running
            process.terminate()
            process.wait()
        sys.exit(0)

    # Register signal handlers for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    # Wait for the process to complete
    try:
        process.wait()
    except KeyboardInterrupt:
        # Handle Ctrl+C gracefully
        if process.poll() is None:
            process.terminate()
            process.wait()
        sys.exit(0)


def main():
    parser = argparse.ArgumentParser(
        description="Convert text to speech using ElevenLabs and play it"
    )
    parser.add_argument("text", help="Text to convert to speech")
    parser.add_argument("--api-key", help="ElevenLabs API key")
    parser.add_argument(
        "--env-file", help="Path to .env file containing ELEVENLABS_API_KEY"
    )

    args = parser.parse_args()

    # Load env file if specified, or try .secrets/.env by default
    if args.env_file:
        load_env_file(args.env_file)
    elif not args.api_key and not os.environ.get("ELEVENLABS_API_KEY"):
        # Try to load .secrets/.env by default
        default_env = Path(".secrets/.env")
        if default_env.exists():
            load_env_file(str(default_env))

    # Get API key
    api_key = get_api_key(args.api_key)

    # Generate and play speech
    print("Generating speech...", file=sys.stderr)
    audio_path = text_to_speech(args.text, api_key)

    print("Playing audio...", file=sys.stderr)
    play_audio(audio_path)

    # Clean up temp file
    os.unlink(audio_path)

    return 0


if __name__ == "__main__":
    sys.exit(main())
