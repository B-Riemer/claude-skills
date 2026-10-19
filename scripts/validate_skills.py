#!/usr/bin/env python3
"""Validate skills/*/SKILL.md, relative links and .claude-plugin/marketplace.json.

Standard library only. Exit code 1 if any check fails.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
FENCE_RE = re.compile(r"^(```|~~~).*?^\1[ \t]*$", re.M | re.S)
MD_LINK_RE = re.compile(r"!?\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+\"[^\"]*\")?\s*\)")
HTML_REF_RE = re.compile(r"""\b(?:src|srcset|href)\s*=\s*["']([^"']+)["']""")
SKIP_PREFIXES = ("http://", "https://", "mailto:", "#", "data:", "tel:")

errors = []


def err(path, msg):
    errors.append(f"{path.relative_to(ROOT)}: {msg}")


def parse_frontmatter(text):
    m = re.match(r"\A---\r?\n(.*?)\r?\n---\r?\n", text, re.S)
    if not m:
        return None
    fm = {}
    key = None
    for line in m.group(1).splitlines():
        km = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
        if km:
            key = km.group(1)
            fm[key] = km.group(2).strip().strip("\"'")
        elif key and line.startswith((" ", "\t")):
            fm[key] += " " + line.strip()
    return fm


def check_skill(skill_md):
    folder = skill_md.parent.name
    fm = parse_frontmatter(skill_md.read_text(encoding="utf-8"))
    if fm is None:
        err(skill_md, "missing YAML frontmatter")
        return
    name = fm.get("name", "")
    if not name:
        err(skill_md, "frontmatter: 'name' missing")
    else:
        if name != folder:
            err(skill_md, f"name '{name}' != folder '{folder}'")
        if len(name) > 64:
            err(skill_md, f"name longer than 64 chars ({len(name)})")
        if not NAME_RE.match(name):
            err(skill_md, f"name '{name}' is not kebab-case")
    desc = fm.get("description", "")
    if not desc:
        err(skill_md, "frontmatter: 'description' missing")
    elif len(desc) > 1024:
        err(skill_md, f"description longer than 1024 chars ({len(desc)})")


def check_links(md_file):
    text = md_file.read_text(encoding="utf-8")
    text = FENCE_RE.sub("", text)
    refs = MD_LINK_RE.findall(text) + HTML_REF_RE.findall(text)
    for ref in refs:
        for part in (ref.split(",") if "," in ref and " " in ref.strip() else [ref]):
            target = part.strip().split()[0] if part.strip() else ""
            if not target or target.startswith(SKIP_PREFIXES):
                continue
            target = target.split("#", 1)[0].split("?", 1)[0]
            if not target:
                continue
            base = ROOT if target.startswith("/") else md_file.parent
            if not (base / target.lstrip("/")).exists():
                err(md_file, f"broken relative link: {part.strip()}")


def check_marketplace():
    path = ROOT / ".claude-plugin" / "marketplace.json"
    if not path.exists():
        err(path, "file missing")
        return
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        err(path, f"invalid JSON: {e}")
        return
    for plugin in data.get("plugins", []):
        pname = plugin.get("name", "?")
        source = plugin.get("source", "./")
        if isinstance(source, str):
            base = ROOT / source
        else:
            base = ROOT
        for s in plugin.get("skills", []):
            p = base / s
            if not p.is_dir():
                err(path, f"plugin '{pname}': skill path not found: {s}")
            elif not (p / "SKILL.md").is_file():
                err(path, f"plugin '{pname}': {s}/SKILL.md missing")


def main():
    skills = sorted((ROOT / "skills").glob("*/SKILL.md"))
    if not skills:
        err(ROOT / "skills", "no skills/*/SKILL.md found")
    for s in skills:
        check_skill(s)
    md_files = sorted((ROOT / "skills").rglob("*.md"))
    readme = ROOT / "README.md"
    if readme.exists():
        md_files.append(readme)
    for f in md_files:
        check_links(f)
    check_marketplace()
    if errors:
        print(f"{len(errors)} problem(s):")
        for e in errors:
            print(f"  - {e}")
        return 1
    print(f"OK: {len(skills)} skill(s), {len(md_files)} markdown file(s) checked.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
