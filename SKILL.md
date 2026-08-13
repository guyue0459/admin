---
name: portfolio-builder
description: Generate or update a responsive personal portfolio website from a resume, project descriptions, images, or a GitHub repository. Use for static GitHub Pages-ready portfolios with responsive layout, project filtering, motion, and a mandatory preview-and-confirmation step before publishing.
---

# Portfolio Builder

Generate a static, mobile-friendly portfolio from a resume and project content. The bundled warm paper-like editorial template is the default, but adapt typography, palette, layout, and motion when the user supplies a different visual direction.

## Inputs

Ask only for missing essentials:

- Resume text/PDF or a short bio and experience list.
- Projects: title, category, description, image, and optional link.
- Contact email and social links.
- Target folder or GitHub repository.
- Optional style direction. Default: **warm off-white editorial**.

Use reasonable placeholder copy and `assets/template/images/placeholder.svg` if images are not yet available. Never reuse personal names, emails, portraits, or project artwork from a previous portfolio.

## Generate

1. Convert the supplied content into the schema below and save it as `portfolio.json` outside the target template.
2. Run `scripts/create_site.py --data <portfolio.json> --out <folder>`. For a different visual direction, adjust the generated CSS and structure before previewing.
3. Inspect the generated page locally at desktop and mobile widths. Preserve the off-white palette, Playfair/Inter pairing, editorial spacing, and restrained motion.
4. Present the preview and explicitly ask: **“是否确认发布这一版？”** Do not write to GitHub, create a commit, deploy, or replace an existing website until the user answers with an unambiguous confirmation such as “确认发布” or “发布这一版”.
5. After confirmation, inspect the target GitHub repository and publish only the generated site files. Do not overwrite unrelated files.

The generator produces a static site. It requires no database, API key, Next.js project, or server.

## Mandatory confirmation gate

Treat preview and publication as two separate stages:

- **Preview stage:** Generate locally and open the preview. Iterate freely on local files.
- **Confirmation stage:** State what will be changed and wait for the user's explicit approval.
- **Publish stage:** Only after approval, commit/upload the approved files and verify the deployed page.

If the user asks to “直接发布” before seeing a preview, generate the preview first and ask for confirmation. Never infer approval from “ok”, “继续”, or silence when the user may only be acknowledging the preview.

## Content schema

```json
{
  "person": {
    "name": "Name",
    "role": "Visual Designer & Illustrator",
    "hero_intro": "One or two concise sentences.",
    "about_title": "A short headline.",
    "about_paragraphs": ["Paragraph one.", "Paragraph two."],
    "skills": ["Figma", "Illustrator"],
    "email": "name@example.com",
    "socials": [{"label": "GitHub", "url": "https://github.com/example"}]
  },
  "experiences": [{
    "period": "2025.04 — 2025.07",
    "category": "Brand design",
    "organization": "Studio Name",
    "role": "Design Intern",
    "description": "What changed or was delivered."
  }],
  "projects": [{
    "title": "Project name",
    "category": "Graphic design",
    "description": "One-sentence project description.",
    "image": "/absolute/path/to/cover.png",
    "url": "https://example.com"
  }]
}
```

Use local absolute paths for `image`; the generator copies them into the output. Omit `image` to use a neutral placeholder. Keep project descriptions short enough to scan.

## Motion guardrails

Keep motion subtle: section entrance (opacity + translateY), staggered project cards, and card hover (small lift, image scale, overlay). Honor `prefers-reduced-motion`. Do not add autoplay video, scroll hijacking, heavy parallax, or decorative cursor effects.

## Bundled resources

- `assets/template/`: static website shell, stylesheet, motion and content renderer, and neutral image placeholder.
- `scripts/create_site.py`: copies the shell, validates the JSON, copies project images, and writes `data/portfolio.json`.
