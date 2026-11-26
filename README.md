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

The build writes the bundled React app to `Asset/dist/app.js`, the path already
used by the static site. `Asset/dist/app.css` is kept intact. Portfolio entries,
including render-stage images, are maintained in `Asset/data/projects.json`.
