#!/bin/bash
# Pick a random .md file from the project
# Usage: ./random_md_picker.sh

cd "$(dirname "$0")/.." || exit 1

echo "Searching for .md files..."
md_files=$(find . -name '*.md' | wc -l | tr -d ' ')
echo "Found $md_files markdown files"
echo ""
echo "🎲 Random pick:"
find . -name '*.md' | sort -R | head -n 1

