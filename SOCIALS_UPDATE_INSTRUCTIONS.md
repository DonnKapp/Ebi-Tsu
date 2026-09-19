# Ebi Tsū Social Icons Update

The About page now shows **only five social icons** under “Stay connected.” The platform names, handles, phone number, and arrow indicators are no longer visible.

Each icon remains an accessible clickable link:

- YouTube: `https://www.youtube.com/@Ebi-Tsū`
- Facebook: `https://www.facebook.com/profile.php?id=61594344066783`
- Instagram: `https://www.instagram.com/Ebi_Tsu/`
- WhatsApp: `https://wa.me/18507764979`
- Telegram: `https://t.me/Ebi_Tsu`

Hovering or focusing an icon exposes its platform label through the browser tooltip/accessibility label.

## Apply to the existing GitHub folder

1. Extract this ZIP into a temporary folder.
2. Copy the contents into the existing `Ebi-Tsu` folder that already contains the hidden `.git` directory.
3. Choose **Replace files** if Windows asks.
4. Do not copy a `.git` folder, `node_modules`, or `dist`.
5. In Git Bash inside the existing `Ebi-Tsu` folder, run:

```bash
git status
git add -A
git commit -m "Use icon-only social links on About page"
git push origin main
```
