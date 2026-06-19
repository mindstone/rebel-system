#!/usr/bin/env python3
"""
Claude Code Conversation Search Tool

Search and retrieve conversations from Claude Code's local JSONL storage.
Supports searching by keyword, date, workspace, listing recent conversations,
and displaying specific conversation details.

Usage:
    python claude_code_conversation_search.py list [--limit N] [--workspace PATH]
    python claude_code_conversation_search.py search "keyword" [--workspace PATH] [--context N]
    python claude_code_conversation_search.py show SESSION_ID [--workspace PATH]
    python claude_code_conversation_search.py workspaces

Storage locations:
    macOS:   ~/.claude/projects/
    Linux:   ~/.claude/projects/
    Windows: %USERPROFILE%\\.claude\\projects\\
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Generator, Optional


def get_claude_projects_dir() -> Path:
    """Get the Claude Code projects directory based on OS."""
    if sys.platform == "win32":
        base = Path(os.environ.get("USERPROFILE", ""))
    else:
        base = Path.home()
    
    return base / ".claude" / "projects"


def get_history_file() -> Path:
    """Get the global history.jsonl file path."""
    if sys.platform == "win32":
        base = Path(os.environ.get("USERPROFILE", ""))
    else:
        base = Path.home()
    
    return base / ".claude" / "history.jsonl"


def decode_workspace_path(encoded_name: str) -> str:
    """Convert encoded folder name back to a displayable path.
    
    Claude Code encodes paths by replacing / with -. This is a lossy encoding
    since folder names can contain dashes. We use heuristics to decode:
    - Leading dash indicates absolute path (starts with /)
    - Common path segments (Users, home, etc.) help identify separators
    """
    if not encoded_name.startswith("-"):
        return encoded_name
    
    # Common path segment patterns that help identify real separators
    # This handles the most common cases on macOS/Linux
    import re
    
    path = encoded_name
    
    # Replace known path prefixes
    prefixes = [
        ("-Users-", "/Users/"),
        ("-home-", "/home/"),
        ("-var-", "/var/"),
        ("-tmp-", "/tmp/"),
        ("-opt-", "/opt/"),
        ("-usr-", "/usr/"),
    ]
    
    for encoded, decoded in prefixes:
        if path.startswith(encoded):
            path = decoded + path[len(encoded):]
            break
    else:
        # Generic fallback - just replace leading dash
        if path.startswith("-"):
            path = "/" + path[1:]
    
    # For the rest, we can't reliably distinguish path separators from dashes in names
    # Return as-is with the prefix decoded (user can identify the workspace)
    return path


def get_all_workspaces(projects_dir: Path) -> list[dict]:
    """Get all workspace directories with conversation counts."""
    workspaces = []
    
    if not projects_dir.exists():
        return workspaces
    
    for item in projects_dir.iterdir():
        if item.is_dir():
            jsonl_files = list(item.glob("*.jsonl"))
            if jsonl_files:
                # Get most recent modification time
                latest_mtime = max(f.stat().st_mtime for f in jsonl_files)
                workspaces.append({
                    "encoded_name": item.name,
                    "path": decode_workspace_path(item.name),
                    "conversation_count": len(jsonl_files),
                    "last_modified": datetime.fromtimestamp(latest_mtime)
                })
    
    # Sort by last modified, most recent first
    workspaces.sort(key=lambda x: x["last_modified"], reverse=True)
    return workspaces


def parse_jsonl_file(filepath: Path) -> Generator[dict, None, None]:
    """Parse a JSONL file, yielding each JSON object."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if line:
                    try:
                        yield json.loads(line)
                    except json.JSONDecodeError as e:
                        # Skip malformed lines
                        continue
    except Exception as e:
        print(f"Warning: Could not read {filepath}: {e}", file=sys.stderr)


def extract_conversation_metadata(filepath: Path) -> Optional[dict]:
    """Extract metadata from a conversation JSONL file."""
    session_id = filepath.stem
    first_timestamp = None
    last_timestamp = None
    message_count = 0
    first_user_message = None
    model_used = None
    
    for entry in parse_jsonl_file(filepath):
        entry_type = entry.get("type")
        timestamp_str = entry.get("timestamp")
        
        if timestamp_str:
            try:
                ts = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
                if first_timestamp is None:
                    first_timestamp = ts
                last_timestamp = ts
            except:
                pass
        
        if entry_type == "user":
            message_count += 1
            if first_user_message is None:
                msg = entry.get("message", {})
                content = msg.get("content", "")
                if isinstance(content, list):
                    # Handle structured content
                    for item in content:
                        if isinstance(item, dict) and item.get("type") == "text":
                            first_user_message = item.get("text", "")[:100]
                            break
                elif isinstance(content, str):
                    first_user_message = content[:100]
        
        elif entry_type == "assistant":
            message_count += 1
            if model_used is None:
                msg = entry.get("message", {})
                model_used = msg.get("model")
    
    if first_timestamp is None:
        return None
    
    return {
        "session_id": session_id,
        "filepath": filepath,
        "first_timestamp": first_timestamp,
        "last_timestamp": last_timestamp,
        "message_count": message_count,
        "preview": first_user_message or "(no preview)",
        "model": model_used
    }


def list_conversations(
    projects_dir: Path,
    workspace_filter: Optional[str] = None,
    limit: int = 20
) -> list[dict]:
    """List recent conversations, optionally filtered by workspace."""
    conversations = []
    
    if workspace_filter:
        # Convert path to encoded form for matching
        if workspace_filter.startswith("/"):
            encoded = workspace_filter.replace("/", "-")
        else:
            encoded = workspace_filter
        
        # Find matching workspace
        workspace_dirs = [
            d for d in projects_dir.iterdir()
            if d.is_dir() and (encoded in d.name or workspace_filter in decode_workspace_path(d.name))
        ]
    else:
        workspace_dirs = [d for d in projects_dir.iterdir() if d.is_dir()]
    
    for workspace_dir in workspace_dirs:
        workspace_path = decode_workspace_path(workspace_dir.name)
        
        for jsonl_file in workspace_dir.glob("*.jsonl"):
            metadata = extract_conversation_metadata(jsonl_file)
            if metadata:
                metadata["workspace"] = workspace_path
                conversations.append(metadata)
    
    # Sort by last timestamp, most recent first
    conversations.sort(key=lambda x: x["last_timestamp"] or datetime.min, reverse=True)
    return conversations[:limit]


def search_conversations(
    projects_dir: Path,
    search_term: str,
    workspace_filter: Optional[str] = None,
    context_lines: int = 1,
    case_insensitive: bool = True
) -> list[dict]:
    """Search for a term in conversation content."""
    results = []
    pattern = re.compile(
        re.escape(search_term),
        re.IGNORECASE if case_insensitive else 0
    )
    
    if workspace_filter:
        if workspace_filter.startswith("/"):
            encoded = workspace_filter.replace("/", "-")
        else:
            encoded = workspace_filter
        workspace_dirs = [
            d for d in projects_dir.iterdir()
            if d.is_dir() and (encoded in d.name or workspace_filter in decode_workspace_path(d.name))
        ]
    else:
        workspace_dirs = [d for d in projects_dir.iterdir() if d.is_dir()]
    
    for workspace_dir in workspace_dirs:
        workspace_path = decode_workspace_path(workspace_dir.name)
        
        for jsonl_file in workspace_dir.glob("*.jsonl"):
            session_id = jsonl_file.stem
            matches_in_file = []
            
            for entry in parse_jsonl_file(jsonl_file):
                entry_type = entry.get("type")
                
                # Search in user and assistant messages
                if entry_type in ("user", "assistant"):
                    msg = entry.get("message", {})
                    content = msg.get("content", "")
                    
                    # Handle structured content
                    if isinstance(content, list):
                        text_content = ""
                        for item in content:
                            if isinstance(item, dict) and item.get("type") == "text":
                                text_content += item.get("text", "") + "\n"
                        content = text_content
                    
                    if pattern.search(str(content)):
                        timestamp_str = entry.get("timestamp", "")
                        try:
                            ts = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
                        except:
                            ts = None
                        
                        # Extract context around match
                        match = pattern.search(str(content))
                        if match:
                            start = max(0, match.start() - 100)
                            end = min(len(content), match.end() + 100)
                            snippet = content[start:end]
                            if start > 0:
                                snippet = "..." + snippet
                            if end < len(content):
                                snippet = snippet + "..."
                        else:
                            snippet = content[:200]
                        
                        matches_in_file.append({
                            "role": entry_type,
                            "timestamp": ts,
                            "snippet": snippet.strip()
                        })
            
            if matches_in_file:
                results.append({
                    "session_id": session_id,
                    "workspace": workspace_path,
                    "filepath": jsonl_file,
                    "matches": matches_in_file
                })
    
    # Sort by most recent match
    results.sort(
        key=lambda x: max((m["timestamp"] or datetime.min for m in x["matches"]), default=datetime.min),
        reverse=True
    )
    return results


def show_conversation(
    projects_dir: Path,
    session_id: str,
    workspace_filter: Optional[str] = None
) -> Optional[str]:
    """Display a specific conversation by session ID."""
    
    if workspace_filter:
        if workspace_filter.startswith("/"):
            encoded = workspace_filter.replace("/", "-")
        else:
            encoded = workspace_filter
        workspace_dirs = [
            d for d in projects_dir.iterdir()
            if d.is_dir() and (encoded in d.name or workspace_filter in decode_workspace_path(d.name))
        ]
    else:
        workspace_dirs = [d for d in projects_dir.iterdir() if d.is_dir()]
    
    # Find the conversation file
    target_file = None
    for workspace_dir in workspace_dirs:
        candidate = workspace_dir / f"{session_id}.jsonl"
        if candidate.exists():
            target_file = candidate
            break
    
    if not target_file:
        return None
    
    output_lines = []
    output_lines.append(f"Session: {session_id}")
    output_lines.append(f"Workspace: {decode_workspace_path(target_file.parent.name)}")
    output_lines.append("=" * 80)
    
    for entry in parse_jsonl_file(target_file):
        entry_type = entry.get("type")
        timestamp_str = entry.get("timestamp", "")
        
        if entry_type == "user":
            msg = entry.get("message", {})
            content = msg.get("content", "")
            
            if isinstance(content, list):
                text_parts = []
                for item in content:
                    if isinstance(item, dict) and item.get("type") == "text":
                        text_parts.append(item.get("text", ""))
                content = "\n".join(text_parts)
            
            output_lines.append(f"\n[USER] {timestamp_str}")
            output_lines.append("-" * 40)
            output_lines.append(str(content))
        
        elif entry_type == "assistant":
            msg = entry.get("message", {})
            content = msg.get("content", [])
            model = msg.get("model", "unknown")
            
            text_parts = []
            tool_uses = []
            
            if isinstance(content, list):
                for item in content:
                    if isinstance(item, dict):
                        if item.get("type") == "text":
                            text_parts.append(item.get("text", ""))
                        elif item.get("type") == "tool_use":
                            tool_uses.append(item.get("name", "unknown_tool"))
            elif isinstance(content, str):
                text_parts.append(content)
            
            output_lines.append(f"\n[ASSISTANT - {model}] {timestamp_str}")
            output_lines.append("-" * 40)
            if text_parts:
                output_lines.append("\n".join(text_parts))
            if tool_uses:
                output_lines.append(f"\n[Tools used: {', '.join(tool_uses)}]")
    
    return "\n".join(output_lines)


def main():
    parser = argparse.ArgumentParser(
        description="Search and browse Claude Code local conversations",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # List command
    list_parser = subparsers.add_parser("list", help="List recent conversations")
    list_parser.add_argument("--limit", "-n", type=int, default=20,
                            help="Number of conversations to show (default: 20)")
    list_parser.add_argument("--workspace", "-w", type=str,
                            help="Filter by workspace path")
    
    # Search command
    search_parser = subparsers.add_parser("search", help="Search conversation content")
    search_parser.add_argument("term", type=str, help="Search term")
    search_parser.add_argument("--workspace", "-w", type=str,
                              help="Filter by workspace path")
    search_parser.add_argument("--context", "-c", type=int, default=1,
                              help="Lines of context around matches")
    search_parser.add_argument("--case-sensitive", "-s", action="store_true",
                              help="Case-sensitive search")
    
    # Show command
    show_parser = subparsers.add_parser("show", help="Display a specific conversation")
    show_parser.add_argument("session_id", type=str, help="Session ID to display")
    show_parser.add_argument("--workspace", "-w", type=str,
                            help="Workspace to search in")
    
    # Workspaces command
    workspaces_parser = subparsers.add_parser("workspaces", 
                                               help="List all workspaces with conversations")
    
    args = parser.parse_args()
    
    projects_dir = get_claude_projects_dir()
    
    if not projects_dir.exists():
        print(f"Error: Claude Code projects directory not found at {projects_dir}", 
              file=sys.stderr)
        print("Make sure Claude Code is installed and has been used at least once.",
              file=sys.stderr)
        sys.exit(1)
    
    if args.command == "workspaces":
        workspaces = get_all_workspaces(projects_dir)
        if not workspaces:
            print("No workspaces with conversations found.")
            sys.exit(0)
        
        print(f"{'Count':>6}  {'Last Modified':<20}  Path")
        print("=" * 80)
        for ws in workspaces:
            print(f"{ws['conversation_count']:>6}  "
                  f"{ws['last_modified'].strftime('%Y-%m-%d %H:%M'):<20}  "
                  f"{ws['path']}")
    
    elif args.command == "list":
        conversations = list_conversations(
            projects_dir,
            workspace_filter=args.workspace,
            limit=args.limit
        )
        
        if not conversations:
            print("No conversations found.")
            sys.exit(0)
        
        print(f"{'#':>3}  {'Date':<16}  {'Msgs':>5}  {'Session ID':<36}  Preview")
        print("=" * 120)
        
        for i, conv in enumerate(conversations, 1):
            date_str = conv["last_timestamp"].strftime("%Y-%m-%d %H:%M") if conv["last_timestamp"] else "Unknown"
            preview = conv["preview"][:50] + "..." if len(conv["preview"]) > 50 else conv["preview"]
            preview = preview.replace("\n", " ")
            
            print(f"{i:>3}  {date_str:<16}  {conv['message_count']:>5}  "
                  f"{conv['session_id']:<36}  {preview}")
    
    elif args.command == "search":
        results = search_conversations(
            projects_dir,
            args.term,
            workspace_filter=args.workspace,
            case_insensitive=not args.case_sensitive
        )
        
        if not results:
            print(f"No matches found for '{args.term}'")
            sys.exit(0)
        
        print(f"Found {sum(len(r['matches']) for r in results)} matches in {len(results)} conversations\n")
        
        for result in results[:20]:  # Limit to first 20 conversations with matches
            print(f"Session: {result['session_id']}")
            print(f"Workspace: {result['workspace']}")
            
            for match in result["matches"][:3]:  # Show up to 3 matches per conversation
                ts_str = match["timestamp"].strftime("%Y-%m-%d %H:%M") if match["timestamp"] else "?"
                print(f"  [{match['role'].upper()}] {ts_str}")
                # Indent snippet
                for line in match["snippet"].split("\n")[:5]:
                    print(f"    {line}")
            
            if len(result["matches"]) > 3:
                print(f"  ... and {len(result['matches']) - 3} more matches")
            print()
    
    elif args.command == "show":
        output = show_conversation(
            projects_dir,
            args.session_id,
            workspace_filter=args.workspace
        )
        
        if output is None:
            print(f"Conversation {args.session_id} not found.", file=sys.stderr)
            sys.exit(1)
        
        print(output)
    
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()

