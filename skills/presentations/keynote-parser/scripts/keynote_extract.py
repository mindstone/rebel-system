#!/usr/bin/env python3
"""
Keynote text extraction script.

Extracts text from Apple Keynote (.key) files using multiple methods:
1. AppleScript (macOS with Keynote.app) - most reliable
2. keynote-parser library (cross-platform)
3. strings fallback (last resort)

Usage:
    python keynote_extract.py /path/to/file.key --output /tmp/output.md
    python keynote_extract.py /path/to/presentations/ --output /tmp/extracted/
"""

import argparse
import json
import os
import subprocess
import sys
import tempfile
import zipfile
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Optional


@dataclass
class ExtractionResult:
    """Result of text extraction from a Keynote file."""
    success: bool
    method: str  # 'applescript', 'parser', 'strings', 'failed'
    slides: list[str] = field(default_factory=list)
    speaker_notes: list[str] = field(default_factory=list)
    title: str = ""
    warnings: list[str] = field(default_factory=list)
    error: Optional[str] = None


def detect_format(path: Path) -> str:
    """Detect Keynote file format."""
    if path.is_dir():
        if (path / "Index.zip").exists():
            return "TRANSITIONAL"
        elif (path / "index.apxl").exists() or (path / "presentation.apxl").exists():
            return "OLD_XML"
        else:
            return "UNKNOWN_DIR"
    
    if path.is_file():
        try:
            with zipfile.ZipFile(path, 'r') as zf:
                names = zf.namelist()
                if any(n.endswith('.iwa') for n in names):
                    return "MODERN_IWA"
                elif "Index.zip" in names:
                    return "TRANSITIONAL_ZIP"
        except zipfile.BadZipFile:
            pass
    
    return "UNKNOWN"


def extract_via_applescript(path: Path) -> ExtractionResult:
    """Extract text using AppleScript (macOS only, requires Keynote.app)."""
    if sys.platform != 'darwin':
        return ExtractionResult(
            success=False,
            method='applescript',
            error="AppleScript only available on macOS"
        )
    
    # AppleScript to extract slide text - uses delimiter-based output for reliable parsing
    # Each slide is separated by a unique delimiter
    delimiter = "<<<SLIDE_SEPARATOR_8f3a2b1c>>>"
    note_delimiter = "<<<NOTE_SEPARATOR_8f3a2b1c>>>"
    
    # Escape quotes in path for AppleScript safety
    escaped_path = str(path).replace('\\', '\\\\').replace('"', '\\"')
    
    script = f'''
    tell application "Keynote"
        try
            -- Try to find if document is already open
            set theDoc to missing value
            set docName to "{escaped_path}"

            repeat with doc in documents
                if (path of doc) is equal to docName then
                    set theDoc to doc
                    exit repeat
                end if
            end repeat

            -- If not open, open it
            set wasAlreadyOpen to true
            if theDoc is missing value then
                set theDoc to open docName
                set wasAlreadyOpen to false
            end if

            set slideTexts to ""
            set noteTexts to ""

            repeat with theSlide in slides of theDoc
                set slideText to ""
                try
                    repeat with theItem in text items of theSlide
                        set slideText to slideText & object text of theItem & linefeed
                    end repeat
                end try
                set slideTexts to slideTexts & slideText & "{delimiter}"

                -- Try to get presenter notes
                try
                    set noteText to presenter notes of theSlide
                    if noteText is missing value then set noteText to ""
                    set noteTexts to noteTexts & noteText & "{note_delimiter}"
                on error
                    set noteTexts to noteTexts & "{note_delimiter}"
                end try
            end repeat

            -- Only close if we opened it
            if not wasAlreadyOpen then
                close theDoc saving no
            end if

            return slideTexts & "<<<NOTES_START>>>" & noteTexts
        on error errMsg
            return "<<<ERROR>>>" & errMsg
        end try
    end tell
    '''
    
    try:
        result = subprocess.run(
            ['osascript', '-e', script],
            capture_output=True,
            text=True,
            timeout=120
        )
        
        if result.returncode != 0:
            return ExtractionResult(
                success=False,
                method='applescript',
                error=f"AppleScript error: {result.stderr}"
            )
        
        output = result.stdout.strip()
        
        # Check for error
        if output.startswith("<<<ERROR>>>"):
            return ExtractionResult(
                success=False,
                method='applescript',
                error=output.replace("<<<ERROR>>>", "").strip()
            )
        
        # Parse slides and notes
        slides = []
        notes = []
        
        if "<<<NOTES_START>>>" in output:
            slides_part, notes_part = output.split("<<<NOTES_START>>>", 1)
            slides = [s.strip() for s in slides_part.split(delimiter) if s.strip()]
            notes = [n.strip() for n in notes_part.split(note_delimiter)]
        else:
            slides = [s.strip() for s in output.split(delimiter) if s.strip()]
        
        if not slides:
            return ExtractionResult(
                success=False,
                method='applescript',
                error="No slides extracted"
            )
        
        return ExtractionResult(
            success=True,
            method='applescript',
            slides=slides,
            speaker_notes=notes,
            title=path.stem
        )
        
    except subprocess.TimeoutExpired:
        return ExtractionResult(
            success=False,
            method='applescript',
            error="AppleScript timed out after 120s"
        )
    except Exception as e:
        return ExtractionResult(
            success=False,
            method='applescript',
            error=str(e)
        )


def extract_via_parser(path: Path) -> ExtractionResult:
    """Extract text using keynote-parser Python library."""
    try:
        from keynote_parser.file_utils import process
        from keynote_parser.codec import IWAFile
    except ImportError:
        return ExtractionResult(
            success=False,
            method='parser',
            error="keynote-parser not installed. Run: pip install keynote-parser"
        )
    
    file_format = detect_format(path)
    
    # Handle transitional format (directory with Index.zip)
    if file_format == "TRANSITIONAL":
        index_zip = path / "Index.zip"
        if index_zip.exists():
            # Pass presentation name (parent directory name) since Index.zip is generic
            return extract_from_zip(index_zip, presentation_name=path.stem)
        return ExtractionResult(
            success=False,
            method='parser',
            error="Transitional format but Index.zip not found"
        )
    
    # Handle transitional ZIP (ZIP containing Index.zip)
    if file_format == "TRANSITIONAL_ZIP":
        # Extract the outer ZIP first to get Index.zip - with safety checks
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                tmpdir_path = Path(tmpdir).resolve()
                with zipfile.ZipFile(path, 'r') as zf:
                    # Apply same security checks as extract_from_zip
                    total_size = sum(info.file_size for info in zf.infolist())
                    if total_size > 500 * 1024 * 1024:
                        return ExtractionResult(
                            success=False,
                            method='parser',
                            error="Outer ZIP file too large (>500MB)"
                        )
                    if len(zf.infolist()) > 10000:
                        return ExtractionResult(
                            success=False,
                            method='parser',
                            error="Outer ZIP contains too many files (>10000)"
                        )
                    for info in zf.infolist():
                        dest = (tmpdir_path / info.filename).resolve()
                        try:
                            dest.relative_to(tmpdir_path)
                        except ValueError:
                            return ExtractionResult(
                                success=False,
                                method='parser',
                                error="Outer ZIP contains path traversal"
                            )
                    zf.extractall(tmpdir_path)
                inner_index = tmpdir_path / "Index.zip"
                if inner_index.exists():
                    return extract_from_zip(inner_index, presentation_name=path.stem)
        except Exception as e:
            return ExtractionResult(
                success=False,
                method='parser',
                error=f"Failed to extract nested ZIP: {e}"
            )
    
    # Handle modern format
    if file_format in ("MODERN_IWA", "UNKNOWN") and path.is_file():
        return extract_from_zip(path)
    
    return ExtractionResult(
        success=False,
        method='parser',
        error=f"Unsupported format: {file_format}"
    )


def extract_from_zip(zip_path: Path, presentation_name: Optional[str] = None) -> ExtractionResult:
    """Extract text from a ZIP-based Keynote file."""
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            tmpdir_path = Path(tmpdir).resolve()
            
            # Security check: validate ZIP before extraction
            with zipfile.ZipFile(zip_path, 'r') as zf:
                total_size = sum(info.file_size for info in zf.infolist())
                if total_size > 500 * 1024 * 1024:  # 500MB limit
                    return ExtractionResult(
                        success=False,
                        method='parser',
                        error="ZIP file too large (>500MB)"
                    )
                
                if len(zf.infolist()) > 10000:  # File count limit
                    return ExtractionResult(
                        success=False,
                        method='parser',
                        error="ZIP contains too many files (>10000)"
                    )
                
                # Check for path traversal and symlinks
                for info in zf.infolist():
                    dest = (tmpdir_path / info.filename).resolve()
                    # Use is_relative_to for secure path check (Python 3.9+)
                    try:
                        dest.relative_to(tmpdir_path)
                    except ValueError:
                        return ExtractionResult(
                            success=False,
                            method='parser',
                            error="ZIP contains path traversal"
                        )
                
                zf.extractall(tmpdir_path)
            
            # Find and parse IWA files
            texts = []
            index_dir = tmpdir_path / "Index"
            if not index_dir.exists():
                # Maybe IWA files are at root
                index_dir = tmpdir_path
            
            for iwa_file in sorted(index_dir.rglob("*.iwa")):
                try:
                    text = extract_text_from_iwa(iwa_file)
                    if text:
                        texts.append(text)
                except Exception as e:
                    pass  # Continue on error
            
            if texts:
                return ExtractionResult(
                    success=True,
                    method='parser',
                    slides=texts,
                    title=presentation_name or zip_path.stem
                )
            
            return ExtractionResult(
                success=False,
                method='parser',
                error="No text content found in IWA files"
            )
            
    except Exception as e:
        return ExtractionResult(
            success=False,
            method='parser',
            error=str(e)
        )


def extract_text_from_iwa(iwa_path: Path) -> str:
    """Extract text from a single IWA file using keynote-parser."""
    try:
        from keynote_parser.codec import IWAFile
        
        with open(iwa_path, 'rb') as f:
            iwa = IWAFile.from_buffer(f.read())
        
        texts = []
        for chunk in iwa.chunks:
            for archive in chunk.archives:
                for obj in archive.objects:
                    # Look for text storage objects
                    if hasattr(obj, 'text') and obj.text:
                        if isinstance(obj.text, str):
                            texts.append(obj.text)
                        elif isinstance(obj.text, (list, tuple)):
                            texts.extend(str(t) for t in obj.text if t)
        
        return '\n'.join(texts)
    except Exception:
        return ""


def extract_via_strings(path: Path) -> ExtractionResult:
    """Fallback: extract raw strings from file."""
    warnings = ["Using strings fallback - output may contain garbage"]
    
    # Check if strings command is available (not on Windows by default)
    if sys.platform == 'win32':
        return ExtractionResult(
            success=False,
            method='strings',
            error="strings command not available on Windows. Install GNU utilities or use a different method.",
            warnings=warnings
        )
    
    try:
        # For directories, find all IWA files
        if path.is_dir():
            files_to_process = list(path.rglob("*.iwa"))
            if (path / "Index.zip").exists():
                files_to_process = [path / "Index.zip"]
        else:
            files_to_process = [path]
        
        all_text = []
        for file_path in files_to_process:
            try:
                result = subprocess.run(
                    ['strings', '-n', '10', str(file_path)],
                    capture_output=True,
                    text=True,
                    timeout=60
                )
            except FileNotFoundError:
                return ExtractionResult(
                    success=False,
                    method='strings',
                    error="strings command not found. Install GNU binutils.",
                    warnings=warnings
                )
            
            # Filter likely text content
            lines = result.stdout.splitlines()
            filtered = [
                line for line in lines
                if len(line) > 10
                and not line.startswith(('TSWP', 'TSP', 'TSK', 'TSD'))
                and not all(c in '0123456789-' for c in line.replace(' ', ''))
                and sum(c.isalpha() for c in line) / len(line) > 0.5
            ]
            all_text.extend(filtered)
        
        if all_text:
            return ExtractionResult(
                success=True,
                method='strings',
                slides=['\n'.join(all_text)],
                title=path.stem,
                warnings=warnings
            )
        
        return ExtractionResult(
            success=False,
            method='strings',
            error="No meaningful text found",
            warnings=warnings
        )
        
    except Exception as e:
        return ExtractionResult(
            success=False,
            method='strings',
            error=str(e),
            warnings=warnings
        )


def extract_keynote(path: Path, method: Optional[str] = None) -> ExtractionResult:
    """
    Extract text from a Keynote file using the best available method.
    
    Args:
        path: Path to the .key file
        method: Force a specific method ('applescript', 'parser', 'strings')
    """
    if method == 'applescript':
        return extract_via_applescript(path)
    elif method == 'parser':
        return extract_via_parser(path)
    elif method == 'strings':
        return extract_via_strings(path)
    
    # Auto-select: try methods in order of reliability
    result = extract_via_applescript(path)
    if result.success:
        return result
    
    result = extract_via_parser(path)
    if result.success:
        return result
    
    return extract_via_strings(path)


def format_output(result: ExtractionResult, source_path: Path) -> str:
    """Format extraction result as Markdown."""
    lines = [f"# {result.title or source_path.stem}", ""]
    
    for i, slide in enumerate(result.slides, 1):
        lines.append(f"## Slide {i}")
        lines.append(slide.strip())
        lines.append("")
    
    if result.speaker_notes and any(result.speaker_notes):
        lines.append("## Speaker Notes")
        for i, note in enumerate(result.speaker_notes, 1):
            if note.strip():
                lines.append(f"### Slide {i}")
                lines.append(note.strip())
                lines.append("")
    
    lines.append("---")
    lines.append(f"Extracted from: {source_path.name}")
    lines.append(f"Method: {result.method}")
    lines.append(f"Slides: {len(result.slides)}")
    
    if result.warnings:
        lines.append(f"Warnings: {', '.join(result.warnings)}")
    
    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(
        description="Extract text from Apple Keynote (.key) files"
    )
    parser.add_argument(
        "input",
        help="Path to .key file or directory of .key files"
    )
    parser.add_argument(
        "--output", "-o",
        help="Output path (file for single input, directory for batch)"
    )
    parser.add_argument(
        "--method", "-m",
        choices=['applescript', 'parser', 'strings', 'auto'],
        default='auto',
        help="Extraction method (default: auto)"
    )
    parser.add_argument(
        "--format", "-f",
        choices=['markdown', 'json', 'text'],
        default='markdown',
        help="Output format (default: markdown)"
    )
    
    args = parser.parse_args()
    input_path = Path(args.input)
    method = None if args.method == 'auto' else args.method
    
    if not input_path.exists():
        print(f"Error: {input_path} not found", file=sys.stderr)
        sys.exit(1)
    
    # Single file
    if input_path.suffix == '.key' or (input_path.is_dir() and 
                                        detect_format(input_path) != "UNKNOWN_DIR"):
        result = extract_keynote(input_path, method)
        
        if args.format == 'json':
            output = json.dumps({
                'success': result.success,
                'method': result.method,
                'slides': result.slides,
                'speaker_notes': result.speaker_notes,
                'title': result.title,
                'warnings': result.warnings,
                'error': result.error
            }, indent=2)
        elif args.format == 'text':
            output = '\n\n'.join(result.slides)
        else:
            output = format_output(result, input_path)
        
        if args.output:
            output_path = Path(args.output)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(output)
            print(f"Wrote: {output_path}")
        else:
            print(output)
        
        sys.exit(0 if result.success else 1)
    
    # Batch processing
    if input_path.is_dir():
        key_files = list(input_path.rglob("*.key"))
        if not key_files:
            print(f"No .key files found in {input_path}", file=sys.stderr)
            sys.exit(1)
        
        output_dir = Path(args.output) if args.output else Path(tempfile.gettempdir()) / "keynote_extracted"
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Determine file extension based on format
        ext = {'markdown': '.md', 'json': '.json', 'text': '.txt'}[args.format]
        
        success_count = 0
        for key_file in key_files:
            print(f"Processing: {key_file.name}")
            result = extract_keynote(key_file, method)
            
            if result.success:
                success_count += 1
                output_file = output_dir / f"{key_file.stem}{ext}"
                
                # Format output based on --format argument
                if args.format == 'json':
                    content = json.dumps({
                        'success': result.success,
                        'method': result.method,
                        'slides': result.slides,
                        'speaker_notes': result.speaker_notes,
                        'title': result.title,
                        'warnings': result.warnings,
                        'error': result.error
                    }, indent=2)
                elif args.format == 'text':
                    content = '\n\n'.join(result.slides)
                else:
                    content = format_output(result, key_file)
                
                output_file.write_text(content)
                print(f"  -> {output_file}")
            else:
                print(f"  FAILED: {result.error}")
        
        print(f"\nExtracted {success_count}/{len(key_files)} files to {output_dir}")
        sys.exit(0 if success_count > 0 else 1)


if __name__ == '__main__':
    main()
