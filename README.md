# Sujoy Das Portfolio

The portfolio is maintained as React source in `src/`. The existing stylesheet,
project assets, and root `index.html` remain the production shell.

## Development

```sh
pnpm install
pnpm dev
```

## Production

```sh
pnpm build
```

The build writes the bundled React app to `Asset/dist/app.js`, the path used
by the static site. Styles are maintained in `src/app.css`, and portfolio data
is maintained in `src/data/projects.json`.
