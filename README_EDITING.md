Task: Rewrite or improve a GitHub project README using proven README best practices.

Goals
- Make the README immediately clear, useful, visually scannable, and credible.
- Optimize for a first-time visitor deciding in under 30 seconds whether to use the project.
- Keep it concise, exciting, and easy to understand.
- Prefer clarity over hype. Prefer concrete value over vague claims.

Required outcomes
1. Open with a strong top section:
   - Project name
   - One-sentence value proposition
   - Optional short subtitle clarifying who it is for
   - Optional badges only if they add real value
2. Explain fast:
   - What it does
   - Why it matters
   - Who it is for
   - What makes it different
3. Add a “Quick Start” or “Getting Started” section near the top.
   - Show the minimum steps to install/run/use it
   - Include copy-pasteable commands
4. Make usage concrete:
   - Add a short example
   - Show expected input/output or common workflow
5. Keep structure scannable:
   - Short paragraphs
   - Clear headings
   - Bullets where helpful
   - Logical order
6. Include only relevant sections.
   Common candidates:
   - Overview / About
   - Features
   - Quick Start
   - Installation
   - Usage
   - Configuration
   - Examples
   - Architecture or How it works
   - Roadmap
   - Contributing
   - License
   - Support / Help
7. Remove weak content:
   - Repetition
   - Generic filler
   - Marketing fluff
   - Long walls of text
   - Empty sections
8. Improve readability:
   - Plain language
   - Active voice
   - Specific nouns and verbs
   - No unexplained jargon
9. Improve credibility:
   - Be accurate about current capabilities
   - Clearly separate shipped features from planned features
   - Do not invent benchmarks, users, integrations, or support channels
10. Improve presentation:
   - Use consistent Markdown formatting
   - Use fenced code blocks for commands
   - Use tables sparingly
   - Add screenshots/GIF/demo links only if they materially help
11. For open-source projects, ensure discoverability and contribution readiness:
   - Mention license if available
   - Point to contributing guidance if available
   - Mention where to get help if known
12. Preserve truth and intent:
   - Do not remove important technical constraints
   - Do not change factual meaning
   - If information is missing, leave a concise placeholder or note instead of fabricating

Style rules
- Tone: confident, modern, professional, readable
- Keep it tight
- Lead with benefits, then mechanics
- Write for humans first, maintainers second
- Avoid buzzword soup
- Avoid “revolutionary,” “game-changing,” etc. unless supported
- Prefer “Install in 2 steps” over long prose
- Prefer “Run this” over explanation when action is enough

Recommended section order
1. Title + one-liner
2. Why this exists / overview
3. Key features
4. Quick start
5. Usage examples
6. Configuration or architecture (if needed)
7. Roadmap (optional)
8. Contributing / support / license

Output format
- Return the revised README in clean Markdown
- Then provide a short changelog summary:
  - What was improved
  - What information is still missing
  - Any sections intentionally omitted

Prerelease preparation checklist
1. Before cutting a release, review `README.md` against this guide.
2. Update `README.md` to add any missing documentation needed for current features, setup, usage, constraints, and support paths.
3. Follow `README_EDITING.md` rules while editing so the README stays accurate, scannable, and release-ready.