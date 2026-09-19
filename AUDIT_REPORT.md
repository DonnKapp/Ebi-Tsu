# Ebi Tsū Website Audit and Quality Upgrade

**Audit date:** September 18, 2026  
**Scope:** Public site, account experience, structured livestock requests, admin dashboard, Supabase authorization, transactional email, performance, responsive behavior, and deployment hygiene.

## Executive summary

The site already had a strong visual foundation and a coherent business workflow. The audit identified several issues that were not merely cosmetic: customers could potentially modify the authorization-bearing `role` field on their own profile, a failed email request could leave the livestock form permanently stuck on **Sending…**, the email function trusted duplicated browser content and reported success even when Resend failed, inventory edits saved on every keystroke, catalog fallbacks could create invalid detail links, and prior handoff archives included a local Manus configuration file that did not belong in a distributable project.

Those issues have been corrected. The live Supabase project now has hardened role permissions, a protected trigger function, consolidated row-level policies, inventory consistency enforcement, email delivery markers, and an updated JWT-protected Edge Function. The frontend now has explicit inventory saves, reliable form completion states, truthful catalog errors, route-level code splitting, branded recovery screens, stronger tablet navigation, better helper-text contrast, and substantially smaller images.

## Implemented improvements

| Area                 | Improvement                                                                                                                                                              | Result                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Authorization        | Removed customer `INSERT` and `UPDATE` access to `profiles.role` while preserving editable profile fields                                                                | Customers cannot promote themselves to admin through the API                                           |
| Database functions   | Revoked public and authenticated RPC execution of `handle_new_user()`                                                                                                    | The security-definer function remains available to the auth trigger but is no longer publicly callable |
| Row-level security   | Consolidated duplicate customer/admin `SELECT` policies and optimized `auth.uid()` evaluation                                                                            | Cleaner access logic and fewer policy-performance warnings                                             |
| Database integrity   | Added a constraint requiring positive price, quantity, and minimum order for `available` or `limited` listings                                                           | The public catalog cannot show an in-stock line with placeholder zero values                           |
| Database performance | Added an index for `livestock_requests.inventory_item_id`                                                                                                                | The catalog-to-request relationship is ready to scale                                                  |
| Inquiry reliability  | Reset saved forms before attempting email and use `finally` to release busy state                                                                                        | A Resend delay no longer leaves a completed form populated or stuck on **Sending…**                    |
| Duplicate protection | Added `owner_notified_at` and `customer_notified_at` delivery markers                                                                                                    | Email retries are idempotent per saved record                                                          |
| Email trust boundary | Updated the Edge Function to accept only a saved record type and ID, verify the JWT, load the record server-side, escape HTML, and return non-2xx on incomplete delivery | Email content now comes from the database rather than untrusted duplicated browser fields              |
| Catalog reliability  | Removed synthetic fallback IDs and added honest loading, empty, retry, and error states                                                                                  | A database outage no longer creates dead catalog links or fabricated availability                      |
| Request workflow     | Preserved exact line and species prefill and clarified that requests are non-binding                                                                                     | Customers understand that requests are not purchases or reservations                                   |
| Admin inventory      | Replaced save-on-every-keystroke behavior with local drafts, validation, and an explicit **Save** action                                                                 | Price, quantity, minimum order, and availability are saved atomically and deliberately                 |
| Account UX           | Corrected pending-verification state and replaced misleading “Response available” labels                                                                                 | The account page no longer implies an unseen response exists                                           |
| Responsive design    | Added a 1080px tablet navigation breakpoint                                                                                                                              | The header no longer crowds or wraps around typical tablet widths                                      |
| Accessibility        | Added consistent `:focus-visible` treatment and improved small helper-text contrast                                                                                      | Keyboard navigation and low-emphasis text are clearer                                                  |
| Recovery states      | Replaced the generic 404 and exposed stack-trace screen with branded recovery pages                                                                                      | Production users no longer see internal error stacks or template UI                                    |
| Performance          | Re-encoded the three core images from 13,450,078 bytes to 768,580 bytes                                                                                                  | **94.29% image-weight reduction** with the original dimensions and composition preserved               |
| Bundle architecture  | Lazy-loaded account, admin, collection, request, and detail routes                                                                                                       | Visitors no longer download every private/business route during the initial home-page load             |
| Dependencies         | Removed unused template components and hundreds of transitive packages; upgraded Express to 5.2.1                                                                        | Production dependency audit now reports **0 vulnerabilities**                                          |
| Schema maintenance   | Added generated Supabase database types and versioned migrations/function source                                                                                         | Future schema drift is easier to detect during TypeScript checks                                       |
| Packaging hygiene    | Removed `.project-config.json`, Manus debug artifacts, unused template files, and obsolete UI components from the handoff                                                | The distributable archive contains only the project’s required source and versioned backend files      |

## Verification completed

| Check                        | Result                                                                                                                        |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| TypeScript                   | `pnpm check` passed with no errors                                                                                            |
| Production build             | `pnpm build` passed                                                                                                           |
| Production dependency audit  | 0 low, 0 moderate, 0 high, 0 critical vulnerabilities                                                                         |
| Supabase Edge Function       | `send-inquiry-email` version 5 is active with JWT verification enabled                                                        |
| Role escalation check        | No anonymous or authenticated `INSERT`/`UPDATE` grant remains on `profiles.role`                                              |
| Supabase security advisor    | Only leaked-password protection remains as an optional account setting                                                        |
| Supabase performance advisor | Previous policy and missing-index warnings resolved; the new index is naturally reported as unused until traffic exercises it |
| Desktop visual check         | Homepage and private-admin denial state passed at 1440×900                                                                    |
| Tablet visual check          | Homepage and collapsed navigation passed at 1024×900                                                                          |
| Mobile visual check          | Homepage, Neocaridina route, account login, and branded 404 passed at 390×844                                                 |
| Live data check              | Skittles detail page loaded correctly from Supabase                                                                           |
| Structured request check     | Skittles and Neocaridina prefilled correctly on the request form                                                              |
| Browser console              | No runtime errors were reported during the checked workflow                                                                   |

## One remaining owner decision

Supabase reports that **leaked-password protection is disabled**. Enabling it would reject passwords known to appear in breach databases. This is a worthwhile security setting, but it changes account-authentication policy and was intentionally not enabled without the owner’s explicit approval. Supabase documents the option in its [password security guidance](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## Handoff safety note

The new handoff archive is sanitized. Older archives created before this audit may contain a local `.project-config.json` file. That file is ignored by Git, but older archives should not be published or shared. If one was ever committed publicly or distributed outside your control, rotate the affected credentials before continuing.
