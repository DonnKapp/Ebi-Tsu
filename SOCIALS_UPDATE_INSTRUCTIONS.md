# Ebi Tsū Colorful Social Icons Update

The About page now shows **only five larger, color-coded social icons** with no black boxes, visible labels, handles, phone number, or URL-style text.

- YouTube: red
- Facebook: blue
- Instagram: pink/red
- WhatsApp: green
- Telegram: blue

Each icon remains an accessible clickable link to the user-provided account. Hovering or focusing an icon exposes its platform label through the browser tooltip/accessibility label.

## Apply to the existing GitHub folder

1. Extract this ZIP into a temporary folder.
2. Copy the contents into the existing `Ebi-Tsu` folder that already contains the hidden `.git` directory.
3. Choose **Replace files** if Windows asks.
4. Do not copy a `.git` folder, `node_modules`, or `dist`.
5. In Git Bash inside the existing `Ebi-Tsu` folder, run:

```bash
git status
git add -A
git commit -m "Use colorful icon-only social links on About page"
git push origin main
```
