# Bharath Bhat — Portfolio

A React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Lenis portfolio.

## Run locally

```bash
npm install
npm run dev
```

Open the local address printed by Vite. Run the production type-check and build with:

```bash
npm run build
```

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. Import the repository in Vercel. Vercel detects Vite automatically.
3. Use `npm run build` as the build command and `dist` as the output directory.

The included `vercel.json` sets the Vite build command and output directory.

## Update portfolio content and media

- Portfolio copy, projects, room assignments, skills, awards, education, and certifications live in `src/data/content.ts`.
- Replace `public/resume.pdf` to update the downloadable resume.
- The portrait is served from `public/me.jpeg`; replace that file to update the portrait.
- Add project images at `public/projects/<project-slug>.jpg` using the slugs shown in each room. The project cards show a labelled schematic placeholder until media is supplied.
