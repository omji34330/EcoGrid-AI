# EcoGrid AI — Pre-Launch Checklist

Companion notes for the files in this kit. Update anything in [BRACKETS] before you deploy.
Assumes `react-router-dom` for routing — adjust the snippets below if you're using something else.

## 1–2. Privacy Policy & Terms
`PrivacyPolicy.tsx` and `Terms.tsx` → `frontend/src/pages/`

Wire into your router:
```tsx
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

<Routes>
  {/* ...your existing routes (Home, Dashboard, Prediction, Reports, Team)... */}
  <Route path="/privacy" element={<PrivacyPolicy />} />
  <Route path="/terms" element={<Terms />} />
  <Route path="/faq" element={<FAQ />} />
  <Route path="*" element={<NotFound />} /> {/* must be last */}
</Routes>
```
Add links to `/privacy` and `/terms` in your footer.

## 3. Clear CTA
One primary action per page, above the fold:
- **Home** → "View Live Dashboard" (button to `/dashboard`)
- **Dashboard** → chatbot toggle stays the secondary action
- **AI Prediction** → "Run Prediction" as the one obvious button
- **Reports** → "Download Report" or "View Full Report"
- **Team** → link to GitHub repo / demo video

## 4. FAQ
`FAQ.tsx` → `frontend/src/pages/`. Swap the placeholder Q&A for your actual judge talking points (data sources, accuracy caveats, tech stack).

## 5. Custom 404
`NotFound.tsx` → `frontend/src/pages/`. Must be the **last** route (`path="*"`) or it'll swallow your real routes.

## 6–7. robots.txt & sitemap.xml
Both go straight into `frontend/public/` — Vite serves anything there at the site root, no code changes needed.
Before deploying to Render, replace `your-domain.com` in both files with your actual Render URL.

## 8. Alt text
Go through every `<img>` and icon-only `<button>`:
- Charts/graphs: `alt="Line chart of daily solar output, 6am–6pm"` — describe the data, not "chart"
- Team photos: `alt="[Name], [Role]"`
- Icon-only buttons (chatbot toggle, theme switch): `aria-label="Open chatbot"` / `aria-label="Toggle dark mode"`
- Purely decorative icons: `alt=""` so screen readers skip them

## 9. Analytics
Pick one — both are a single `<script>` tag in `frontend/index.html`, no backend change needed:
- **Plausible** (privacy-friendly, no cookie banner needed):
  `<script defer data-domain="your-domain.com" src="https://plausible.io/js/script.js"></script>`
- **Google Analytics 4**: standard `gtag.js` snippet with your `G-XXXXXXX` measurement ID

Same pattern as your `GEMINI_MODEL` env var — put the ID in `VITE_GA_ID` (or similar) rather than hardcoding it.

## 10. Favicon
`favicon.svg` → `frontend/public/`, replacing the default Vite icon.
In `frontend/index.html`:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

---
**Not covered here on purpose:** these are all frontend/static-hosting items. Your FastAPI backend doesn't need its own robots.txt or sitemap — those only matter for the publicly crawled site, which is your Vite frontend.
