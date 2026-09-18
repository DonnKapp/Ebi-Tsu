# Ebi Tsū GitHub handoff

This bundle contains the completed Ebi Tsū website foundation and the local image assets used by the design.

## Put it into GitHub

1. Extract this folder.
2. Open a terminal inside the extracted `ebi-tsu-github-handoff` folder.
3. Run `pnpm install`.
4. Run `pnpm dev` to preview locally.
5. Copy the contents into your `DonnKapp/Ebi-Tsu` repository, or initialize Git here:

```bash
git init
git add .
git commit -m "Initial Ebi Tsū website"
git branch -M main
git remote add origin https://github.com/DonnKapp/Ebi-Tsu.git
git push -u origin main
```

The site is a Vite + React + TypeScript frontend. The main UI code is in `client/src/` and the local shrimp imagery is in `client/public/assets/`.

The contact email is intentionally a placeholder in `client/src/pages/About.tsx` and should be replaced before launch.
