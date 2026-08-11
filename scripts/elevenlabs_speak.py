#!/usr/bin/env python3
"""
ElevenLabs Text-to-Speech generator.

Generates an MP3 from text using the ElevenLabs API and writes it to a file.
This script does not play audio — it only produces a file. Play the result
through a surface you control (Rebel's read-aloud, your media player, etc.).

Usage:
    python3 elevenlabs_speak.py "Text to speak" --out brief.mp3
    python3 elevenlabs_speak.py "Text to speak" --out brief.mp3 --api-key YOUR_KEY
    python3 elevenlabs_speak.py "Text to speak" --out brief.mp3 --env-file .secrets/.env
"""

import argparse
import json
import os
import sys
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


def text_to_speech(text: str, api_key: str, out_path: str) -> None:
    """Convert text to speech and write the MP3 to out_path."""
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

    with urllib.request.urlopen(req) as response:
        with open(out_path, "wb") as f:
            f.write(response.read())


def main():
    parser = argparse.ArgumentParser(
        description=(
            "Generate speech audio from text using ElevenLabs. "
            "Writes an MP3 file; does not play it."
        )
    )
    parser.add_argument("text", help="Text to convert to speech")
    parser.add_argument(
        "--out",
        required=True,
        help="Path to write the generated MP3 (the script does not play audio)",
    )
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

    # Generate speech file
    print("Generating speech...", file=sys.stderr)
    text_to_speech(args.text, api_key, args.out)

    print(f"Wrote {args.out}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
