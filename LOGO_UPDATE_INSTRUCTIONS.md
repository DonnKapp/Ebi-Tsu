# Ebi Tsū Approved Logo Integration

The approved shrimp artwork is now integrated into the shared brand component.

## Included changes

- Added the newly approved peach shrimp logo as `client/public/assets/ebi-tsu-logo.webp`.
- Replaced the temporary inline circular SVG in `client/src/components/BrandMark.tsx`.
- Updated shared sizing in `client/src/index.css` so the wide shrimp mark works in the header, mobile navigation, and footer.
- Preserved the peach primary color on both light and dark pages, with the existing black-and-white eye, outlines, and egg detail intact.

The full-resolution transparent master PNG remains outside the deployable app package so it can be retained for merchandise and future vector production.

## Install into the existing GitHub-connected folder

1. Extract this ZIP into a separate temporary folder.
2. Copy the **contents inside the extracted folder** into the existing `Ebi-Tsu` folder that already contains the hidden `.git` directory.
3. Replace files when Windows asks. Do not copy a `.git` folder, `node_modules`, or `dist`.
4. In Git Bash inside the existing `Ebi-Tsu` folder, run:

```bash
git status
git add -A
git commit -m "Replace placeholder emblem with approved Ebi Tsu logo"
git push origin main
```

5. Confirm the push succeeds before checking Cloudflare Deployments.

Do not run `git init`, `git remote add`, `git reset --hard`, or force-push.
