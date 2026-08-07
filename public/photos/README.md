# Photos of the shop

Drop image files in this folder and redeploy. They appear on the home page in a
section called **The build**, between the founder's note and the Grand Opening
invitation.

- Any `.jpg`, `.jpeg`, `.png`, `.webp` or `.avif` file is picked up automatically.
- Files show in **filename order** — name them `01-`, `02-`, `03-` to control it.
- The **first** photo is the big one. Put the best shot first.
- Captions are optional. To add one, put a line in `captions.json`:

```json
{
  "01-storefront.jpg": "The front, the week the sign went up.",
  "02-counter.jpg": "Where the counter is going."
}
```

**If this folder has no photos in it, the whole section disappears from the
site.** Nothing breaks, nothing shows a grey box — it simply isn't there until
there's something real to show.

Phone photos are fine. Landscape works best for the first one.
