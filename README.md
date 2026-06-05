# Rupanjana Choudhury Portfolio

This portfolio has been migrated from vanilla HTML, CSS, and JavaScript to Astro while preserving the original design, animations, responsiveness, and browser behavior.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Migration Map

- `index.html` page structure moved into `src/pages/index.astro`.
- Shared document shell, metadata, fonts, Font Awesome, header, footer, stylesheet import, and script import moved into `src/layouts/Layout.astro`.
- Header markup moved into `src/components/Header.astro`.
- Hero section moved into `src/components/Hero.astro`.
- About section moved into `src/components/About.astro`.
- Experience section moved into `src/components/Experience.astro`.
- Tech Stack section moved into `src/components/TechStack.astro`.
- Projects section moved into `src/components/Projects.astro` and `src/components/ProjectCard.astro`.
- Events section moved into `src/components/Events.astro` and `src/components/EventCard.astro`.
- Contact section moved into `src/components/Contact.astro`.
- Repeated section headings moved into `src/components/SectionHeading.astro`.
- `style.css` moved to `src/styles/global.css`.
- `script.js` moved to `src/scripts/site.js`.
- `assets/*` copied to `public/assets/*` for static Astro serving.

## Content Collections

Projects, events, and experience entries now live in Astro Content Collections:

- Projects: `src/content/projects/*.md`
- Events: `src/content/events/*.md`
- Experience: `src/content/experience/*.md`
- Schemas: `src/content/config.ts`

To add a new project, create a Markdown file in `src/content/projects/`. You can start from `docs/templates/project.md`.

```md
---
title: "New Project"
description: "Short project summary."
image: "https://example.com/project.png"
imageAlt: "Project preview"
category: "full-stack"
order: 3
links:
  - label: "GitHub"
    href: "https://github.com/username/repo"
  - label: "Live Demo"
    href: "https://example.com"
---
```

The project will appear automatically on the homepage and participate in the project filters. The `category` can be any text, such as `frontend`, `react`, `full-stack`, `ml`, or `backend`; Astro generates the filter button from the Markdown value.

## Adding a Project After Creating a New Repo

1. Push your project code to GitHub.
2. Add a project preview image somewhere public, or place it in `public/assets/` and use a path like `/assets/my-project.png`.
3. Create a new Markdown file:

```bash
cp docs/templates/project.md src/content/projects/my-new-project.md
```

4. Edit the frontmatter fields in that Markdown file.
5. Run the site locally:

```bash
npm run dev
```

6. Open the local URL Astro prints, usually `http://127.0.0.1:4321/`.
7. When it looks right, commit and push the portfolio repo. If this site is deployed on Netlify, Vercel, or another Git-based host, the change appears after the deployment finishes.

You do not need to edit `src/pages/index.astro` or any component to add a project card.
