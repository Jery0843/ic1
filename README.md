# FUSION-SDG 2026 Conference Website

This is the production deployment package for the FUSION-SDG 2026 conference website.

## Setup & Deployment

1. Install dependencies:
```bash
npm install
```

2. Build the production bundle:
```bash
npm run build
```

3. Start the production server:
```bash
npm start
```

Or deploy to your preferred hosting platform (Vercel, Netlify, etc.).

## Project Structure

- `app/` - Next.js application pages and API routes
- `components/` - Reusable React components
- `lib/` - Utility functions and configurations
- `public/` - Static assets (images)

## Configuration Files

- `next.config.ts` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration
- `tsconfig.json` - TypeScript configuration