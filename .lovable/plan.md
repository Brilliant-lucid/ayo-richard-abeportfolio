## Goal
Make the featured portfolio cards on the landing page show each person's actual imagery instead of just an avatar + text.

## Recommendation on blur
Blur is not needed. These portfolios are published and public by the owner's own choice, so a sharp preview image is more attractive and gets more clicks. Legibility is solved with a dark gradient overlay behind the text, not by blurring the image. The only place a blur is useful is as a decorative, low-opacity background wash on the "Your portfolio here" placeholder tiles.

## What to build

1. **Cover image for each featured portfolio**
   - Extend the featured-portfolios data fetch so each portfolio also returns a cover image, picked in this order: the owner's hero image, else the cover image of their most recent project, else their avatar, else none.
   - Keep the existing published-only filter and limit.

2. **Redesigned card**
   - Card becomes an image tile (4:3 or 16:10) with the cover image filling it, a bottom-to-top dark gradient, and the avatar, display name, username and tagline sitting on top of the gradient.
   - Subtle hover: image zooms slightly, card lifts, "View portfolio" pill appears.
   - Portfolios with no image at all fall back to the current clean text-only card on a tinted background, so nothing looks broken.

3. **Placeholder tiles**
   - Keep the "Your portfolio here" invite tiles filling the grid to 12, restyled to match the new image-tile shape, using a soft blurred gradient wash so they read as empty slots rather than real portfolios.

4. **Details**
   - Images lazy-loaded with proper alt text ("<name>'s portfolio cover") for SEO and performance.
   - Cards remain links to `/u/<username>`.

## Technical notes
- Update `listFeaturedPortfolios` in `src/lib/cms/public.functions.ts` to join/lookup hero and latest project cover per owner and return a `cover_url` field.
- Update the featured grid in `src/routes/index.tsx` for the new card markup; no schema/migration changes required.
