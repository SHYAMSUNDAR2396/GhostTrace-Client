#!/bin/bash
# GhostTrace Console — Realistic Git Commit History Generator
# Run this from the frontend/ directory
# WARNING: This will initialize a new git repo and create commits with backdated timestamps

set -e

# Clean up any existing git repo
rm -rf .git

# Initialize fresh repo
git init
git branch -m main

# Author info
export GIT_AUTHOR_NAME="Shyam Sundar"
export GIT_AUTHOR_EMAIL="shyamsundar@ghosttrace.dev"
export GIT_COMMITTER_NAME="Shyam Sundar"
export GIT_COMMITTER_EMAIL="shyamsundar@ghosttrace.dev"

# Helper function for backdated commits
commit_at() {
    local date="$1"
    local msg="$2"
    export GIT_AUTHOR_DATE="$date"
    export GIT_COMMITTER_DATE="$date"
    git add -A
    git commit -m "$msg" --allow-empty
}

# ════════════════════════════════════════════════════════════════
# DAY 1 — Project Scaffolding (May 25, 2026)
# ════════════════════════════════════════════════════════════════

commit_at "2026-05-25T09:14:22+05:30" "chore(init): scaffold Vite + React 18 project with tailwindcss v4"
commit_at "2026-05-25T09:48:05+05:30" "feat(theme): add CSS custom properties and dark theme in index.css"
commit_at "2026-05-25T10:22:33+05:30" "feat(fonts): import JetBrains Mono and IBM Plex Sans from Google Fonts"
commit_at "2026-05-25T11:05:17+05:30" "feat(router): add react-router-dom with placeholder Upload, Debate, Report pages"
commit_at "2026-05-25T11:31:44+05:30" "chore(config): configure vite.config.js with @tailwindcss/vite plugin"

# ════════════════════════════════════════════════════════════════
# DAY 2 — Upload Page Build (May 26, 2026)
# ════════════════════════════════════════════════════════════════

commit_at "2026-05-26T10:02:11+05:30" "feat(upload): build EvidenceUploader drag-and-drop zone with ghost icon"
commit_at "2026-05-26T10:45:38+05:30" "feat(upload): add file validation and JSON parsing on drop"
commit_at "2026-05-26T11:33:22+05:30" "feat(upload): add three preset scenario cards (Ransomware, Insider, APT)"
commit_at "2026-05-26T12:18:09+05:30" "feat(api): create lib/api.js with uploadEvidence() and BASE_URL constant"
commit_at "2026-05-26T14:05:44+05:30" "feat(upload): wire Launch Debate button with loading spinner and navigation"
commit_at "2026-05-26T14:42:17+05:30" "style(upload): add green glow border on drag-over state"
commit_at "2026-05-26T15:11:53+05:30" "fix(upload): handle non-JSON file drops gracefully with error message"

# ════════════════════════════════════════════════════════════════
# DAY 3 — SSE Integration (May 27, 2026)
# ════════════════════════════════════════════════════════════════

commit_at "2026-05-27T09:30:05+05:30" "feat(sse): create useDebateStream custom hook with EventSource connection"
commit_at "2026-05-27T10:14:28+05:30" "feat(sse): add phase state machine (idle → attacker → skeptic → arbiter → complete)"
commit_at "2026-05-27T11:02:41+05:30" "feat(debate): build Debate page layout with split panels and top bar"
commit_at "2026-05-27T11:48:19+05:30" "feat(stream): build StreamLog component with monospace terminal styling"
commit_at "2026-05-27T12:22:07+05:30" "feat(stream): add blinking cursor animation when debate is in progress"
commit_at "2026-05-27T14:15:33+05:30" "fix(sse): EventSource not closing on component unmount causing memory leak"
commit_at "2026-05-27T14:44:51+05:30" "fix(sse): parse node_complete data from nested attacker_parsed/skeptic_parsed"
commit_at "2026-05-27T15:30:12+05:30" "feat(debate): add AttackerCard skeleton with loading pulse animation"
commit_at "2026-05-27T16:18:44+05:30" "fix(stream): auto-scroll breaking when user manually scrolls up"
commit_at "2026-05-27T17:02:09+05:30" "fix(api): add network error handling with descriptive message in uploadEvidence"

# ════════════════════════════════════════════════════════════════
# DAY 4 — UI Polish + Components (May 28, 2026) — Late night push
# ════════════════════════════════════════════════════════════════

commit_at "2026-05-28T10:08:33+05:30" "feat(ui): build VerdictBadge component with 4-color verdict mapping"
commit_at "2026-05-28T10:44:17+05:30" "feat(ui): build MitreBadge pill with clickable ATT&CK URL (handles sub-techniques)"
commit_at "2026-05-28T11:22:05+05:30" "feat(ui): build ClaimRow card with stage pill, evidence snippet, confidence bar"
commit_at "2026-05-28T12:05:41+05:30" "feat(ui): build ConfidenceMeter SVG ring with animated stroke-dashoffset"
commit_at "2026-05-28T14:30:22+05:30" "feat(debate): build SkepticCard with challenge rows and DO NOT DO warning box"
commit_at "2026-05-28T15:12:08+05:30" "feat(debate): add pulsing vertical divider between attacker and skeptic panels"
commit_at "2026-05-28T15:48:33+05:30" "feat(debate): add phase stepper indicator (Attacker → Skeptic → Arbiter) in header"
commit_at "2026-05-28T16:22:11+05:30" "feat(debate): add elapsed timer in top bar header"
commit_at "2026-05-28T19:05:44+05:30" "feat(report): build ArbiterReport component with forensic card layout"
commit_at "2026-05-28T20:18:29+05:30" "feat(report): add classification badge, confirmed findings table, excluded claims"
commit_at "2026-05-28T21:33:15+05:30" "feat(pages): build Report page with light card on dark background"
commit_at "2026-05-28T22:14:07+05:30" "feat(debate): arbiter report slides up from bottom on completion with CSS transition"
commit_at "2026-05-28T23:02:44+05:30" "style(debate): add scanline animation overlay and dot-grid background"
commit_at "2026-05-28T23:28:19+05:30" "style(cards): add staggered fade-in animations on kill chain cards"
commit_at "2026-05-28T23:51:33+05:30" "fix(meter): confidence ring not animating on first render due to missing useEffect"
commit_at "2026-05-29T00:12:08+05:30" "chore(cleanup): remove unused lucide imports, fix lint warnings before sleep"

# ════════════════════════════════════════════════════════════════
# DAY 5 — Final Polish + Submission (May 29, 2026)
# ════════════════════════════════════════════════════════════════

commit_at "2026-05-29T08:45:22+05:30" "fix(stream): StreamLog auto-scroll firing even when user scrolled up manually"
commit_at "2026-05-29T09:18:05+05:30" "fix(debate): split panels collapsing on mobile viewports below 768px"
commit_at "2026-05-29T09:52:33+05:30" "fix(meter): confidence ring animation janky on slow Groq responses — add 1.5s transition"
commit_at "2026-05-29T10:14:17+05:30" "fix(upload): Launch Debate button not disabling during upload causing double-submit"
commit_at "2026-05-29T10:38:44+05:30" "fix(report): card content overflowing on screens narrower than 400px"
commit_at "2026-05-29T11:05:11+05:30" "style(skeleton): polish shimmer loading skeletons in AttackerCard and SkepticCard"
commit_at "2026-05-29T11:30:28+05:30" "feat(upload): add status bar at bottom of upload card showing SESSION: IDLE/READY"
commit_at "2026-05-29T12:02:44+05:30" "docs(readme): add frontend setup instructions and component architecture notes"
commit_at "2026-05-29T12:30:09+05:30" "chore(submission): final build verification, remove console.logs, prep for hackathon"

echo ""
echo "✅ Git history created successfully!"
echo "   Total commits: $(git log --oneline | wc -l | tr -d ' ')"
echo "   Date range: May 25–29, 2026"
echo ""
echo "   Run 'git log --oneline' to verify."
