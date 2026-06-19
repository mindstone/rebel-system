#!/usr/bin/env bash
# Victory flourish - randomly selected celebration for successful onboarding

set -euo pipefail

# Pick a random flourish (1-5)
FLOURISH=$((1 + RANDOM % 5))

case $FLOURISH in
  1)
    # ASCII art celebration
    echo ""
    echo "🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉"
    echo ""
    cat << 'EOF'
    ██╗   ██╗ ██████╗ ██╗   ██╗    ██████╗ ██╗██████╗     ██╗████████╗██╗
    ██║   ██║██╔═══██╗██║   ██║    ██╔══██╗██║██╔══██╗    ██║╚══██╔══╝██║
    ██║   ██║██║   ██║██║   ██║    ██║  ██║██║██║  ██║    ██║   ██║   ██║
    ██║   ██║██║   ██║██║   ██║    ██║  ██║██║██║  ██║    ██║   ██║   ╚═╝
    ╚██████╔╝╚██████╔╝╚██████╔╝    ██████╔╝██║██████╔╝    ██║   ██║   ██╗
     ╚═════╝  ╚═════╝  ╚═════╝     ╚═════╝ ╚═╝╚═════╝     ╚═╝   ╚═╝   ╚═╝
EOF
    echo ""
    echo "🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉"
    echo ""
    ;;
  
  2)
    # Open a celebration in the browser
    echo "🎊 Opening a special surprise in your browser..."
    sleep 1
    open "https://www.youtube.com/watch?v=3GwjfUFyY6M" 2>/dev/null || \
      xdg-open "https://www.youtube.com/watch?v=3GwjfUFyY6M" 2>/dev/null || \
      echo "🎉 Victory! (Browser open failed, but you still win!)"
    ;;
  
  3)
    # Terminal confetti animation
    echo ""
    echo "🎊 CONFETTI TIME! 🎊"
    echo ""
    for i in {1..3}; do
      echo "$(printf '🎉%.0s' {1..20})"
      sleep 0.3
      echo "$(printf '✨%.0s' {1..20})"
      sleep 0.3
      echo "$(printf '🎈%.0s' {1..20})"
      sleep 0.3
    done
    echo ""
    echo "🌟 ONBOARDING COMPLETE! 🌟"
    echo ""
    ;;
  
  4)
    # Create and open a temporary HTML celebration page
    TEMP_HTML=$(mktemp /tmp/victory_XXXXXX.html)
    cat > "$TEMP_HTML" << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>🎉 Victory!</title>
  <style>
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      overflow: hidden;
    }
    .container {
      text-align: center;
      color: white;
      z-index: 10;
    }
    h1 {
      font-size: 4em;
      margin: 0;
      animation: bounce 1s infinite;
    }
    p {
      font-size: 1.5em;
      margin: 20px;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    .confetti {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #ffd700;
      animation: fall 3s linear infinite;
    }
    @keyframes fall {
      to { transform: translateY(100vh) rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎉 YOU DID IT! 🎉</h1>
    <p>Onboarding Complete!</p>
    <p style="font-size: 1.2em;">Welcome to Rebel 🚀</p>
  </div>
  <script>
    for(let i=0; i<50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.background = ['#ffd700', '#ff69b4', '#00ff00', '#00bfff'][Math.floor(Math.random()*4)];
      document.body.appendChild(confetti);
    }
    setTimeout(() => window.close(), 5000);
  </script>
</body>
</html>
EOF
    echo "🎊 Opening victory celebration page..."
    open "$TEMP_HTML"
    sleep 6
    rm -f "$TEMP_HTML"
    ;;
  
  5)
    # Fun terminal-based achievement unlocked
    echo ""
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║                                                        ║"
    echo "║            🏆  ACHIEVEMENT UNLOCKED  🏆                ║"
    echo "║                                                        ║"
    echo "║                \"The Rebel Master\"                     ║"
    echo "║                                                        ║"
    echo "║       Successfully completed AI onboarding            ║"
    echo "║              +1000 XP earned                          ║"
    echo "║                                                        ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo ""
    echo "🎮 Special bonus: You've unlocked access to the full Rebel workspace (skills, memory, and scripts)!"
    echo "💎 Rare achievement: Only a handful of legendary users have reached this level"
    echo ""
    ;;
esac

echo ""
echo "✨ Press any key to continue your journey... ✨"

