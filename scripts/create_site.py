#!/usr/bin/env python3
"""Create a Guyue-style static portfolio from a JSON content file."""
import argparse
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "assets" / "template"
REQUIRED_PERSON = {"name", "role", "hero_intro", "about_title", "email"}

def fail(message):
    print(f"Error: {message}", file=sys.stderr)
    raise SystemExit(1)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True, help="Path to portfolio JSON")
    parser.add_argument("--out", required=True, help="New output folder")
    args = parser.parse_args()
    data_path, output = Path(args.data).expanduser(), Path(args.out).expanduser()
    if not data_path.is_file(): fail(f"data file not found: {data_path}")
    if output.exists() and any(output.iterdir()): fail(f"output folder is not empty: {output}")
    try: data = json.loads(data_path.read_text())
    except json.JSONDecodeError as error: fail(f"invalid JSON: {error}")
    person = data.get("person", {})
    missing = REQUIRED_PERSON - person.keys()
    if missing: fail("person is missing: " + ", ".join(sorted(missing)))
    for index, project in enumerate(data.get("projects", []), 1):
        missing_project = {"title", "category", "description"} - project.keys()
        if missing_project: fail(f"project {index} is missing: {', '.join(sorted(missing_project))}")
    shutil.copytree(TEMPLATE, output, dirs_exist_ok=True)
    image_folder = output / "images" / "projects"; image_folder.mkdir(parents=True, exist_ok=True)
    for index, project in enumerate(data.get("projects", []), 1):
        image = project.get("image")
        if not image: continue
        source = Path(image).expanduser()
        if not source.is_file(): fail(f"project {index} image not found: {source}")
        target = image_folder / f"project-{index}{source.suffix.lower()}"
        shutil.copy2(source, target)
        project["image"] = target.relative_to(output).as_posix()
    (output / "data").mkdir(exist_ok=True)
    (output / "data" / "portfolio.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(f"Created portfolio at {output}")

if __name__ == "__main__": main()
