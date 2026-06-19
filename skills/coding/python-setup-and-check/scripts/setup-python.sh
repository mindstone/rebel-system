#!/bin/bash
# setup-python.sh - Cross-platform Python virtual environment setup
# 
# This script automates Python venv creation and dependency installation
# for non-technical users. Works on Mac and Linux (and Git Bash on Windows).
#
# Usage:
#   ./scripts/setup-python.sh
#   ./scripts/setup-python.sh --requirements path/to/requirements.txt
#
# Based on best practices from the Python community (2024)

set -e  # Exit on any error

# Colors for output (if terminal supports it)
if [ -t 1 ]; then
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    RED='\033[0;31m'
    NC='\033[0m' # No Color
else
    GREEN=''
    YELLOW=''
    RED=''
    NC=''
fi

# Helper functions
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_step() {
    echo -e "\n${GREEN}==>${NC} $1"
}

# Parse arguments
REQUIREMENTS_FILE="requirements.txt"
VENV_DIR=".venv"
RECREATE="false"
CHECK_ONLY="false"
while [[ $# -gt 0 ]]; do
    case $1 in
        --requirements)
            REQUIREMENTS_FILE="$2"
            shift 2
            ;;
        --venv-path)
            VENV_DIR="$2"
            shift 2
            ;;
        --recreate)
            RECREATE="true"
            shift
            ;;
        --check)
            CHECK_ONLY="true"
            shift
            ;;
        --help)
            echo "Usage: $0 [--requirements path/to/requirements.txt] [--venv-path .venv] [--recreate] [--check]"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Detect OS and set Python command
print_step "Detecting system..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS_NAME="macOS"
    PYTHON_CMD="python3"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS_NAME="Linux"
    PYTHON_CMD="python3"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS_NAME="Windows (Git Bash)"
    PYTHON_CMD="python"
else
    OS_NAME="Unknown"
    PYTHON_CMD="python3"
    print_warning "Unknown OS type: $OSTYPE. Trying python3..."
fi
print_success "Detected: $OS_NAME"

# Check if Python is installed
print_step "Checking Python installation..."
if ! command -v $PYTHON_CMD &> /dev/null; then
    print_error "Python not found!"
    echo ""
    echo "Please install Python from:"
    echo "  • macOS/Linux: https://www.python.org/downloads/"
    echo "  • Windows: https://www.python.org/downloads/windows/"
    echo ""
    echo "⚠️  Windows users: Make sure to check 'Add Python to PATH' during installation!"
    exit 1
fi

# macOS guard: /usr/bin/python3 and /usr/bin/python are Apple xcode-select
# stubs. RUNNING one (even `--version`) pops the "install command line
# developer tools" dialog when the tools aren't installed. Detect that case
# WITHOUT executing the stub: resolve the path (command -v does not exec) and
# query developer-tools state (`xcode-select -p` does not trigger the dialog).
# Only fall through to running the interpreter once we know it's real.
if [[ "$OS_NAME" == "macOS" ]]; then
    PYTHON_PATH="$(command -v "$PYTHON_CMD" || true)"
    if [[ "$PYTHON_PATH" == "/usr/bin/python3" || "$PYTHON_PATH" == "/usr/bin/python" ]]; then
        if ! xcode-select -p &> /dev/null; then
            print_error "No real Python is installed."
            echo ""
            echo "macOS only ships a placeholder at $PYTHON_PATH that asks to install"
            echo "Apple's developer tools when run — it is not a working Python."
            echo "Install a real Python instead, then re-run this script:"
            echo "  • Homebrew:   brew install python"
            echo "  • python.org: https://www.python.org/downloads/macos/"
            exit 1
        fi
    fi
fi

PYTHON_VERSION=$($PYTHON_CMD --version 2>&1)
print_success "Found: $PYTHON_VERSION"

# Check if we're already in a virtual environment
if [[ -n "$VIRTUAL_ENV" ]]; then
    print_warning "Already in a virtual environment: $VIRTUAL_ENV"
    echo "Deactivate it first with: deactivate"
    exit 1
fi

# Decide venv directory:
# - Prefer user-specified VENV_DIR
# - Else prefer existing .venv
# - Else fall back to existing venv
if [[ "$VENV_DIR" == ".venv" || "$VENV_DIR" == "venv" ]]; then
    if [ -d ".venv" ]; then
        VENV_DIR=".venv"
    elif [ -d "venv" ]; then
        VENV_DIR="venv"
    fi
fi

# CHECK MODE: perform validations only
if [[ "$CHECK_ONLY" == "true" ]]; then
    print_step "Running checks (no changes will be made)..."
    STATUS=0
    if [ -d "$VENV_DIR" ]; then
        print_success "Found virtual environment at '$VENV_DIR'"
        if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
            VENV_PY="$VENV_DIR/Scripts/python.exe"
        else
            VENV_PY="$VENV_DIR/bin/python"
        fi
        if [ -x "$VENV_PY" ]; then
            "$VENV_PY" -c "import sys; print(sys.executable)"
            if [ -f "$REQUIREMENTS_FILE" ]; then
                # Rough check: ensure each requirement base name appears in freeze output
                FREEZE_OUT=$("$VENV_PY" -m pip freeze 2>/dev/null || true)
                MISSING=0
                while IFS= read -r req; do
                    [[ -z "$req" || "$req" =~ ^# ]] && continue
                    base="${req%%[<>=!~ ]*}"
                    if ! grep -i -q "^${base}==" <<< "$FREEZE_OUT"; then
                        print_warning "Requirement not satisfied (approximate check): $req"
                        MISSING=1
                    fi
                done < "$REQUIREMENTS_FILE"
                if [[ "$MISSING" == "0" ]]; then
                    print_success "Requirements appear satisfied (approximate)"
                else
                    STATUS=1
                fi
                if "$VENV_PY" -m pip check >/dev/null 2>&1; then
                    print_success "pip check passed"
                else
                    print_warning "pip check reported issues"
                    STATUS=1
                fi
            else
                print_warning "No $REQUIREMENTS_FILE present to validate"
            fi
        else
            print_error "Could not find Python interpreter inside venv"
            STATUS=1
        fi
    else
        print_warning "No virtual environment found at '$VENV_DIR'"
        STATUS=1
    fi
    if [[ "$STATUS" == "0" ]]; then
        print_success "All checks passed"
        exit 0
    else
        print_warning "One or more checks failed. Re-run without --check to set up."
        exit 1
    fi
fi

# Recreate if requested
if [ -d "$VENV_DIR" ] && [[ "$RECREATE" == "true" ]]; then
    print_step "Recreating virtual environment at '$VENV_DIR'..."
    rm -rf "$VENV_DIR"
fi

# Create virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    print_step "Creating virtual environment at '$VENV_DIR'..."
    $PYTHON_CMD -m venv "$VENV_DIR"
    print_success "Virtual environment created in ./$VENV_DIR/"
else
    print_step "Using existing virtual environment at '$VENV_DIR'..."
fi

# Activate virtual environment
print_step "Activating virtual environment..."
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    source "$VENV_DIR/Scripts/activate"
else
    source "$VENV_DIR/bin/activate"
fi
print_success "Activated"

# Upgrade pip/setuptools/wheel to latest version
print_step "Upgrading pip, setuptools, and wheel..."
python -m pip install --quiet --upgrade pip setuptools wheel
PIP_VERSION=$(pip --version)
print_success "Tooling upgraded: $PIP_VERSION"

# Install dependencies if requirements.txt exists
if [ -f "$REQUIREMENTS_FILE" ]; then
    print_step "Installing dependencies from $REQUIREMENTS_FILE..."
    pip install --quiet -r "$REQUIREMENTS_FILE"
    print_success "Dependencies installed"
    print_step "Validating installed packages..."
    if pip check >/dev/null 2>&1; then
        print_success "Dependency integrity check passed"
    else
        print_warning "Dependency integrity check reported issues (see above)"
    fi
else
    print_warning "No $REQUIREMENTS_FILE found - skipping dependency installation"
    echo "Create a requirements.txt file to list your project dependencies"
fi

# Create .gitignore if it doesn't exist, or ensure venv is ignored
print_step "Checking .gitignore..."
if [ ! -f ".gitignore" ]; then
    echo ".venv/" > .gitignore
    echo "venv/" >> .gitignore
    echo "__pycache__/" >> .gitignore
    echo "*.pyc" >> .gitignore
    print_success "Created .gitignore"
elif ! grep -q "^\.\?venv/" .gitignore || ! grep -q "^venv/" .gitignore; then
    if ! grep -q "^\.\?venv/" .gitignore; then echo ".venv/" >> .gitignore; fi
    if ! grep -q "^venv/" .gitignore; then echo "venv/" >> .gitignore; fi
    print_success "Updated .gitignore with venv entries"
else
    print_success ".gitignore already configured"
fi

# Final success message
echo ""
print_success "Python environment setup complete!"
echo ""
echo "Next steps:"
echo "  1. Activate the environment:"
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    echo "     source venv/Scripts/activate"
else
    echo "     source venv/bin/activate"
fi
echo "  2. Run your Python scripts"
echo "  3. When done, deactivate with: deactivate"
echo ""
print_warning "Note: The virtual environment is already activated in this terminal session!"

