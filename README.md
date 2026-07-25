# netrunner

Personal portfolio for Jamin (`@justjammin`), an AI engineer who builds agent tooling, presented as
a Cyberpunk 2077 netrunner quickhack panel. Personal content comes from
[justjammin.github.io](https://justjammin.github.io/) and the project log is drawn from his public
repos and gists. The visual language, information architecture and motion are new.

## Running it

Static site. No build step, nothing to install.

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

## Layout

```
index.html            single page, all content in the initial HTML
css/style.css         design tokens + every section
js/main.js            GSAP ScrollTrigger choreography
js/bg.js              Three.js breach-protocol shader background
vendor/               GSAP, ScrollTrigger and Three.js, vendored locally
assets/video/         feed01.mp4 (hero), feed02.mp4 (footer)
assets/preprod/       manga character sheet, intro and outro storyboards, panel crops
scripts/gen-video.sh  regenerate the hero clip via the Higgsfield CLI
.impeccable.md        design context: who this is for and how it should feel
DESIGN-DNA.json       design system, style and visual-effects profile
```

Libraries are vendored rather than loaded from a CDN so the page works offline and survives a
strict content-security policy.

## Design decisions worth knowing

- **Single page, no router.** The previous site used client-side routes that returned HTTP 404 on
  GitHub Pages and only rendered because `404.html` rehydrated the app. One scrolling document
  avoids that entirely and suits the parallax.
- **Amber is the primary accent, not cyan.** Cyberpunk's real UI signature is a hot yellow; cyan is
  demoted to a secondary scan accent and red is alert-only. The manga pre-production art in
  `assets/preprod/` is locked to the same three accents so the video and the interface read as one
  system.
- **Content ships in the HTML.** Roughly 6 KB of plain text is in the initial response, so search
  engines and AI crawlers read the whole page without executing JavaScript. The old SPA served a
  725-byte shell.

## Motion and accessibility

All motion sits behind `gsap.matchMedia()`. Under `prefers-reduced-motion: reduce`:

- the WebGL layer never mounts
- the pinned quickhack panel and horizontal project track become static layouts
- no element is left hidden waiting on an animation that will not run
- video is suppressed and the poster frame shows in its place

Animations use transform and opacity only. Scroll is scrubbed, never hijacked. The shader caps
device pixel ratio at 1.5 and pauses its render loop when the tab is hidden.

## Pre-production art

`assets/preprod/` holds a manga character sheet and two six-panel storyboards, all generated with
Nano Banana Pro through the Higgsfield CLI and locked to the site's amber, cyan and red palette.

- `character-sheet.jpg` is the character bible: four turnaround views and four expression studies.
- `storyboard.jpg` is the intro shot list. Alley establishing shot, walk cycle, boot impact, target
  lock on a cyborg antagonist, the quickhack menu, and the visor flare.
- `storyboard-outro.jpg` is the outro shot list, a fisheye mecha cockpit sequence.
- `cockpit-key.jpg` is the outro key frame and the `--start-image` for the cockpit clip. Camera sits
  behind the pilot looking forward through a panoramic canopy, console banked across the lower third.
  That over-the-shoulder framing is what makes it read as a cockpit; an earlier version shot the
  pilot chest-up facing camera and the cockpit disappeared behind him.
- `panels/` holds individual panel crops, which are what actually get fed to the video model.

A note on generated art: these models invent studio credits and watermarks unprompted. One pass
produced a fabricated "© TOEI ANIMATION" line, which was removed. Check every generation for false
attribution before committing it.

## Regenerating the videos

Both clips come from Seedance 2.0, driven by the pre-production art above. Feeding it panel crops as
references is what keeps the character consistent between the stills and the footage.

```bash
higgsfield auth login
higgsfield workspace set <workspace_id>
```

Intro (`feed01.mp4`, portrait). Hero in the foreground from behind, cyborg advancing down the alley,
quickhack bracket locking onto it. Passing both the hero panel and the villain panel as references is
what gets both characters into the shot.

```bash
higgsfield generate create seedance_2_0 \
  --aspect-ratio 9:16 --duration 8 --resolution 1080p --genre noir --generate-audio false \
  --image-references assets/preprod/character-sheet.jpg \
  --image-references assets/preprod/panels/p2.jpg \
  --image-references assets/preprod/panels/p4.jpg \
  --prompt "<see scripts/gen-video.sh>" --wait
```

Outro (`feed02.mp4`, landscape, cockpit). The `--start-image` is doing real work: it locks the wide
fisheye framing for the full eight seconds.

```bash
higgsfield generate create seedance_2_0 \
  --aspect-ratio 16:9 --duration 8 --resolution 1080p --genre noir --generate-audio false \
  --start-image assets/preprod/cockpit-key.jpg \
  --prompt "<hold the wide fisheye, do not push in>" --wait
```

Re-encode before committing, because raw output runs 8 to 30 MB:

```bash
ffmpeg -i raw.mp4 -an \
  -vf "scale=720:1280:flags=lanczos,fade=t=in:st=0:d=0.35,fade=t=out:st=7.5:d=0.45" \
  -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart \
  assets/video/feed01.mp4
```

## Deploying

Built for GitHub Pages. If you deploy to a subpath (for example `justjammin.github.io/netrunner/`)
rather than the domain root, update the absolute URLs in `index.html` (`canonical`, `og:url`,
`og:image`, and the `@id` values in the JSON-LD block), plus `sitemap.xml` and `robots.txt`. Every
asset path is already relative and needs no change.
