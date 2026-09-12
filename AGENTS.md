# Repository Guidelines

## Project Structure & Module Organization

This is a React 19 + Vite 8 single-page portfolio. Entry points live in `src/main.jsx` and `src/App.jsx`. Full-screen slides and shared visual pieces are in `src/components/`; keep slide roots as direct children of the container in `App.jsx`. Snap-scrolling rules and design tokens live in `src/index.css`, while slide styling is organized by section in `src/App.css`.

Place imported images in `src/assets/`. Put static, publicly served assets such as video, SVGs, and favicons in `public/`. The production output is `dist/` and must not be edited manually.

## Build, Test, and Development Commands

Run commands from the repository root:

```bash
npm ci             # install the locked dependency set
npm run dev         # start Vite with hot-module reload
npm run lint        # check JS and JSX with ESLint
npm run build       # create the production bundle in dist/
npm run preview     # serve the built bundle locally
```

There is no automated test suite. Before submitting changes, run `npm run lint` and `npm run build`, then exercise affected slides, scroll transitions, and responsive layouts.

## Coding Style & Naming Conventions

Use plain JSX and ES modules; this project does not use TypeScript. Follow the existing two-space indentation and omit semicolons. Name React component files in PascalCase (for example, `ContactSlide.jsx`) and component functions similarly. Use descriptive camelCase for variables and props.

Preserve the existing CSS prefix convention: `hero-`, `ms2-` through `ms5-`, `ct-`, `to-`, and `ar-`. Keep slide-specific styling in its corresponding banner section of `src/App.css`. ESLint is configured in `eslint.config.js` with React Hooks and React Refresh rules.

## Navigation, Assets, and Deployment

Slide IDs (`home`, `missions`, `achievements`, `arsenal`, `legend`, `contact`) are coupled across slide roots, `App.jsx`, and `TransitionOverlay.jsx`. When adding, removing, or reordering slides, update all three locations and `totalSlides` together.

`vite.config.js` uses a relative base path for GitHub Pages. Reference `public/` assets with `${import.meta.env.BASE_URL}asset.ext`; import `src/assets/` files as modules. Do not use root-relative public paths such as `/jw1.mp4`.

## Commit & Pull Request Guidelines

Use concise, imperative commit subjects consistent with history, such as `Fix asset paths for Pages deployment`. Keep commits focused. Pull requests should describe the visible change, identify affected slides, link relevant issues, and include screenshots or a short recording for visual or animation changes. Confirm lint and production build results in the description.
