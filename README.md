# claude-skills

Agent skills I build and use for my own work, packaged for [Claude Code](https://claude.com/claude-code) and any agent that supports the open skills format ([skills.sh](https://skills.sh)).

## Skills

| Skill | What it does |
| --- | --- |
| [`apple-design-pro`](skills/apple-design-pro/SKILL.md) | Reviews websites for small flaws and missing polish (accessibility, responsiveness, Core Web Vitals, visual craft, generic "template look", motion, microcopy) and guides building Apple-grade motion and interaction on the web. Findings are ranked Critical / High / Medium / Low, each with evidence and a concrete fix. |

## Install

```bash
# one skill
npx skills add B-Riemer/claude-skills@apple-design-pro -g

# all skills in this repo
npx skills add B-Riemer/claude-skills -g
```

## Usage

```
Review https://example.com with apple-design-pro
Make this landing page look less generic
Add an interruptible bottom sheet with spring physics
```

## Credits

- `apple-design-pro/references/motion-principles.md` is adapted from [emilkowalski/skills](https://github.com/emilkowalski/skills) (`apple-design`), MIT License, Copyright (c) 2026 Emil Kowalski. The license text is included in that file.
- Apple's Human Interface Guidelines are linked, not copied. All other text is my own.

## License

MIT, see [LICENSE](LICENSE).
