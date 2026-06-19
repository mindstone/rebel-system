#!/usr/bin/env python3
"""
Read Mac Stickies app content

This script accesses the Mac Stickies.app data stored in:
~/Library/Containers/com.apple.Stickies/Data/Library/Stickies/

Usage:
  python3 read-mac-stickies.py                        # List all stickies with colors and sizes
  python3 read-mac-stickies.py --all                  # Read text content of all stickies
  python3 read-mac-stickies.py --search "deadline"    # Find stickies containing text
  python3 read-mac-stickies.py --largest              # Show text from largest sticky
  python3 read-mac-stickies.py --uuid <UUID>          # Show text from specific sticky
  python3 read-mac-stickies.py --color purple         # Filter stickies by color
  python3 read-mac-stickies.py --color blue --search "project"  # Combine filters

Author: Team Member, Rebel
Last updated: 2026-03-27
"""

import plistlib
import subprocess
import re
import sys
import argparse
from pathlib import Path

STICKIES_DIR = Path.home() / "Library/Containers/com.apple.Stickies/Data/Library/Stickies"
STATE_FILE = STICKIES_DIR / ".SavedStickiesState"


def get_stickies_metadata():
    """Read the SavedStickiesState plist file."""
    if not STATE_FILE.exists():
        print(f"Error: Stickies state file not found at {STATE_FILE}", file=sys.stderr)
        print("Make sure you're running this on macOS with Stickies app data.", file=sys.stderr)
        sys.exit(1)

    result = subprocess.run(
        ['plutil', '-convert', 'xml1', '-o', '-', str(STATE_FILE)],
        capture_output=True, text=True, check=True
    )
    return plistlib.loads(result.stdout.encode())


def parse_size(size_str):
    """Parse size string like '{592, 117}' into (width, height)."""
    match = re.search(r'\{(\d+),\s*(\d+)\}', size_str)
    if match:
        return int(match.group(1)), int(match.group(2))
    return 0, 0


def describe_color(r, g, b):
    """Describe color in human terms."""
    if r > 0.9 and g > 0.9 and b > 0.9:
        return "white/gray"
    elif r > g and r > b and b < 0.6:
        return "pink/red"
    elif g > r and g > b:
        return "green"
    elif b > g and b > r:
        return "blue"
    elif r > g and b > g:
        return "purple"
    elif r > 0.9 and g > 0.9:
        return "yellow"
    else:
        return "other"


def read_sticky_text(uuid):
    """Read text content from a sticky by UUID."""
    rtfd_path = STICKIES_DIR / f"{uuid}.rtfd" / "TXT.rtf"
    if not rtfd_path.exists():
        return None

    result = subprocess.run(
        ['textutil', '-convert', 'txt', '-stdout', str(rtfd_path)],
        capture_output=True, text=True, check=True
    )
    return result.stdout


def list_stickies(color_filter=None):
    """List all stickies with metadata, optionally filtered by color."""
    plist = get_stickies_metadata()

    stickies = []
    for sticky in plist:
        color = sticky.get('StickyColor', {})
        r = color.get('Red', 0)
        g = color.get('Green', 0)
        b = color.get('Blue', 0)

        size_str = sticky.get('ExpandedSize', '{0, 0}')
        width, height = parse_size(size_str)

        uuid = sticky.get('UUID', 'unknown')

        color_desc = describe_color(r, g, b)

        # Apply color filter if specified
        if color_filter and color_filter.lower() not in color_desc.lower():
            continue

        stickies.append({
            'uuid': uuid,
            'width': width,
            'height': height,
            'color_desc': color_desc,
            'rgb': (r, g, b)
        })

    # Sort by height (descending)
    stickies.sort(key=lambda x: x['height'], reverse=True)

    if color_filter:
        print(f"Found {len(stickies)} stickies matching color '{color_filter}':\n")
    else:
        print(f"Found {len(stickies)} stickies:\n")

    for i, sticky in enumerate(stickies, 1):
        r, g, b = sticky['rgb']
        print(f"{i}. {sticky['uuid']}")
        print(f"   Size: {sticky['width']}×{sticky['height']}px")
        print(f"   Color: {sticky['color_desc']} (RGB: {r:.2f}, {g:.2f}, {b:.2f})")
        print()

    return stickies


def main():
    parser = argparse.ArgumentParser(
        description='Read Mac Stickies content',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 read-mac-stickies.py                            # List all stickies
  python3 read-mac-stickies.py --all                      # Read all stickies' text
  python3 read-mac-stickies.py --search "deadline"        # Find stickies containing text
  python3 read-mac-stickies.py --largest                  # Show largest sticky's text
  python3 read-mac-stickies.py --color purple             # List purple stickies
  python3 read-mac-stickies.py --color blue --search "Q2" # Search within blue stickies
  python3 read-mac-stickies.py --uuid ABC123...           # Show specific sticky
        """
    )
    parser.add_argument('--all', action='store_true', help='Read and display text of all stickies')
    parser.add_argument('--search', help='Find stickies containing this text (case-insensitive)')
    parser.add_argument('--largest', action='store_true', help='Show text from largest sticky')
    parser.add_argument('--uuid', help='Show text from specific sticky UUID')
    parser.add_argument('--color', help='Filter by color (purple, blue, green, yellow, pink/red, white/gray)')

    args = parser.parse_args()

    if args.uuid:
        text = read_sticky_text(args.uuid)
        if text:
            print(f"Content of sticky {args.uuid}:\n")
            print(text)
        else:
            print(f"Could not find sticky with UUID {args.uuid}", file=sys.stderr)
            sys.exit(1)

    elif args.search:
        stickies = list_stickies(color_filter=args.color)
        if not stickies:
            print("No stickies found matching criteria.", file=sys.stderr)
            sys.exit(1)
        needle = args.search.lower()
        matches = []
        for sticky in stickies:
            text = read_sticky_text(sticky['uuid'])
            if text and needle in text.lower():
                matches.append((sticky, text))
        if not matches:
            print(f"No stickies found containing '{args.search}'.", file=sys.stderr)
            sys.exit(1)
        print(f"Found {len(matches)} sticky/stickies containing '{args.search}':\n")
        for sticky, text in matches:
            print(f"{'='*60}")
            print(f"STICKY: {sticky['uuid']} ({sticky['color_desc']}, {sticky['width']}x{sticky['height']}px)")
            print('='*60)
            print(text)
            print()

    elif args.largest:
        stickies = list_stickies(color_filter=args.color)
        if stickies:
            largest = stickies[0]
            print(f"\n{'='*60}")
            print(f"TEXT FROM LARGEST STICKY ({largest['width']}x{largest['height']}px):")
            print('='*60 + '\n')
            text = read_sticky_text(largest['uuid'])
            if text:
                print(text)
        else:
            print("No stickies found matching criteria.", file=sys.stderr)
            sys.exit(1)

    elif args.all:
        stickies = list_stickies(color_filter=args.color)
        if not stickies:
            print("No stickies found.", file=sys.stderr)
            sys.exit(1)
        for sticky in stickies:
            text = read_sticky_text(sticky['uuid'])
            if text:
                print(f"{'='*60}")
                print(f"STICKY: {sticky['uuid']} ({sticky['color_desc']}, {sticky['width']}x{sticky['height']}px)")
                print('='*60)
                print(text)
                print()

    else:
        # Default: just list metadata
        list_stickies(color_filter=args.color)


if __name__ == '__main__':
    main()
