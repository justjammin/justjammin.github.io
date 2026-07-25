#!/usr/bin/env bash
# Regenerate the site's two clips with Seedance 2.0, driven by the manga
# pre-production art in assets/preprod/.
#
# Requires:
#   higgsfield auth login
#   higgsfield workspace set <workspace_id>
#
# Usage:
#   ./scripts/gen-video.sh models    # list available video models
#   ./scripts/gen-video.sh intro     # alley walk, portrait  -> feed01
#   ./scripts/gen-video.sh outro     # cockpit boot, landscape -> feed02

set -euo pipefail
cd "$(dirname "$0")/.."

MODEL="${MODEL:-seedance_2_0}"

INTRO_PROMPT='A 1980s retro-anime sci-fi confrontation rendered as vintage Japanese cel animation,
vertical composition. A dark rain-slicked Neo-Tokyo alleyway at night, towering megastructures and
hanging Japanese signage receding into fog. In the lower foreground, seen from behind and slightly to
one side, the HERO: a Black man with dark brown skin and a short faded afro, high-collar technical
jacket, a slim glowing amber visor band on his eyes. At the far end of the alley, upper frame, the
VILLAIN looms and advances: a hulking chrome-plated cyborg enforcer with one glowing red optic lens,
exposed neck cabling and a heavy mechanical jaw plate. Slow push down the alley toward the villain.
Midway an angular amber quickhack targeting bracket snaps into frame and locks onto the cyborg, his
red optic flaring in alarm, thin scanlines and chromatic aberration flickering across the image,
amber readout text scrolling beside the lock. Rain falls steadily, neon reflections pooling in the wet
asphalt. Bold cel-shaded ink line art, heavy black shadows, halftone screentone texture, subtle 35mm
film grain. Strictly limited palette: warm near-black shadows, hot amber yellow on the HUD and visor
glow and signage, sparing electric cyan on secondary signs and puddle reflections, one alarm red on
the cyborg optic, no other hues. Vintage Japanese animation aesthetic, confident linework, cinematic
framing.'

# Two load-bearing details here. The "does NOT push in" instruction keeps the
# fisheye from collapsing into a flat close-up within two seconds. The
# over-the-shoulder framing (camera behind the pilot, canopy filling the upper
# frame, console banked across the lower third) is what makes it read as a
# cockpit rather than a portrait with switches behind it.
OUTRO_PROMPT='A 1980s retro-anime sci-fi scene rendered as vintage Japanese cel animation. Locked-off
extreme fisheye wide-angle shot from inside a retro mecha cockpit, camera behind and slightly above
the pilot looking forward over his shoulder. The camera does NOT push in and does NOT move closer.
Hold the full wide fisheye framing for the entire shot: heavy barrel distortion curving the canopy
frame and console edges outward, the huge panoramic curved canopy filling the upper two thirds, the
banked instrument console sweeping across the lower third and curving up the left and right edges.
The pilot stays seen from behind, centered, small in frame, both gloved hands on twin control grips.
Only these things animate: amber CRT readouts flicker and flare on one by one across the console,
thin cyan indicator strips pulse in sequence, red warning lamps blink, rain streaks run down the
curved canopy glass, and the warped rain-soaked Neo-Tokyo skyline drifts very slowly past outside as
the craft holds position. The whole cockpit stays in frame the entire time, wide and distorted. Bold
cel-shaded ink line art, heavy black shadows, halftone screentone texture, subtle 35mm film grain.
Strictly limited palette: warm near-black cockpit shadows, hot amber yellow readouts, sparing electric
cyan indicators, red warning lamps, no other hues. Vintage Japanese animation aesthetic, confident
linework, symmetrical composition.'

case "${1:-}" in
  models)
    higgsfield model list --video
    ;;

  intro)
    higgsfield generate cost "$MODEL" --prompt "$INTRO_PROMPT" \
      --aspect-ratio 9:16 --duration 8 --resolution 1080p || true
    higgsfield generate create "$MODEL" \
      --aspect-ratio 9:16 --duration 8 --resolution 1080p --genre noir --generate-audio false \
      --image-references assets/preprod/character-sheet.jpg \
      --image-references assets/preprod/panels/p2.jpg \
      --image-references assets/preprod/panels/p4.jpg \
      --prompt "$INTRO_PROMPT" \
      --wait --wait-timeout 12m
    echo
    echo "Encode to assets/video/feed01.mp4:"
    echo '  ffmpeg -i raw.mp4 -an -vf "scale=720:1280:flags=lanczos,fade=t=in:st=0:d=0.35,fade=t=out:st=7.5:d=0.45" \'
    echo '    -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart assets/video/feed01.mp4'
    ;;

  outro)
    higgsfield generate cost "$MODEL" --prompt "$OUTRO_PROMPT" \
      --aspect-ratio 16:9 --duration 8 --resolution 1080p || true
    higgsfield generate create "$MODEL" \
      --aspect-ratio 16:9 --duration 8 --resolution 1080p --genre noir --generate-audio false \
      --start-image assets/preprod/cockpit-key.jpg \
      --prompt "$OUTRO_PROMPT" \
      --wait --wait-timeout 12m
    echo
    echo "Encode to assets/video/feed02.mp4:"
    echo '  ffmpeg -i raw.mp4 -an -vf "scale=1280:720:flags=lanczos,fade=t=in:st=0:d=0.35,fade=t=out:st=7.5:d=0.45" \'
    echo '    -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart assets/video/feed02.mp4'
    ;;

  *)
    echo "Usage: $0 {models|intro|outro}" >&2
    exit 1
    ;;
esac
