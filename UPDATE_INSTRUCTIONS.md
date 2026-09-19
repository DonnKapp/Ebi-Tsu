# Ebi Tsū — Ordering, Availability, and Mobile Scroll Update

This package is a **complete replacement of the website project files**. It deliberately does **not** contain a `.git` folder or `node_modules` folder. That means it is safe to copy into the existing **working GitHub clone** while preserving the Git connection already on the computer.

## What this update adds

The collection cards now reset the scroll position immediately at click time, preventing the mobile view from showing the previous lower scroll position and visibly traveling to the top. A second route-level guard preserves the same behavior for all site navigation.

The public site now includes an **Ordering & availability** reference page at `/ordering`. It clearly distinguishes browsing and non-binding livestock requests from purchasing, while providing editable working-draft messages for availability, ordering, shipping, live-arrival terms, and payment. Each livestock line now has an editable public availability note, displayed on its individual line page. The owner-only Admin dashboard now includes controls for both those line-level notes and the public ordering guidance.

The associated Supabase migration is included in `supabase/migrations/20260919155000_add_storefront_availability_and_policy_settings.sql` and has already been applied to the live Ebi Tsū Supabase project. It is included in Git so the repository continues to reflect the live database schema.

## Install into the existing Ebi Tsū GitHub folder

1. Open the existing project folder—the one that is already connected to `DonnKapp/Ebi-Tsu` and contains the hidden `.git` folder. **Do not run `git init`, `git branch`, or `git remote add`.**
2. Extract this ZIP somewhere separate. Open the extracted update folder, select **all of its contents**, and copy them into the existing project folder. Choose **Replace the files in the destination** if Windows asks. Do not copy the update folder itself inside the project folder.
3. Open Git Bash inside that existing project folder and run the following commands one at a time:

```bash
git remote -v
npm install --package-lock=false
npm run check
npm run build
git status
git add -A
git commit -m "Add ordering guidance and fix mobile collection scroll"
git push origin HEAD
```

4. Before `git add -A`, check the output of `git remote -v`. Both displayed URLs should point to `https://github.com/DonnKapp/Ebi-Tsu.git`. If they do not, stop before committing or pushing.
5. Once `git push origin HEAD` succeeds, the existing Cloudflare GitHub deployment will build automatically. The public site should then show the immediate collection-card transition and the new Ordering & availability link in the footer.

## Owner workflow after deployment

Sign in with the admin account and open `/admin`. Under **Availability management**, choose a status, quantities, pricing, and a concise public availability note for each line, then click **Save** for that specific line. Under **Ordering guidance**, edit the five draft messages and choose **Save guidance**. Those messages publish immediately to `/ordering`.

The starter messages intentionally do not claim live shipping, a live-arrival policy, or payment terms. Replace each only when the real business terms are finalized.
