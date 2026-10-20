# AMORA companion prompt kit

Reverse-engineered from the client's ChatGPT references (Inés, Sofia) and the approved Gina set.
Use it to restyle existing companions or create new ones. Works in ChatGPT, Gemini, Figma AI, ideal.ai,
and local SDXL tools (Draw Things / ComfyUI). Paste blocks in this order: **Style → Identity → Shot → Rules**.

Content line for AMORA: flirty, seductive, revealing fashion is in; nudity and sexual acts are out.
Every character is a fictional adult, written as 21+ in the prompt.

---

## 1. Master style block (paste every time)

```
Photorealistic lifestyle photo, shot like a high-end Instagram influencer editorial on a full-frame camera,
50mm or 85mm lens, f/1.8, shallow depth of field with creamy background blur.
Light: warm golden-hour sunlight streaming in from the side, soft glow and gentle bloom around her hair,
lifted shadows, no harsh contrast, bright and airy overall.
Colour palette: peach, blush pink, cream, warm sand, with one accent colour (turquoise, lilac, coral or
cherry red). Warm, sun-kissed, slightly film-like colour, subtle fine film grain.
Skin: glowing, dewy, sun-kissed, real skin texture with pores and a few faint freckles, natural flush on the
cheeks and shoulders, no plastic or airbrushed skin.
Mood: playful, warm, flirty and intimate, like a candid photo her partner took. She looks into the lens
with a soft knowing smile, head slightly tilted.
Vertical 2:3 framing, face sharp and clearly readable, eyes in the upper third.
```

## 2. Identity block (one per girl, keep it word-for-word on every shot)

Fill this template and reuse it unchanged for all her photos. Being specific is what keeps the face consistent.

```
She is [NAME], a fictional [AGE 21+]-year-old [NATIONALITY] woman from [CITY].
Face: [face shape], [eye colour + shape], [brows], [nose], [lips], [one distinctive mark: mole / freckles /
dimple / gap / beauty spot]. Skin: [tone, undertone].
Hair: [colour], [length], [texture], [usual styling].
Body: [slim / athletic / curvy / petite], natural proportions.
Signature details: [jewellery: thin gold chain, small gold hoops], [nails], [makeup: soft glam, glossy lips].
```

**Consistency tips**
- Always attach her best existing portrait as a reference image and say: *"Same woman as the reference image:
  keep her exact face, features, hair, skin tone and body identical."*
- For a set of shots, ask for a contact sheet (section 5) instead of separate images. Faces drift much less
  inside one image.
- In local tools, use the face-reference feature (PuLID / IP-Adapter FaceID / InstantID) with her portrait,
  plus a fixed seed for the portrait shot.

## 3. Shot library (pick one per image)

### Heat levels
| Level | Use for | Wardrobe |
|---|---|---|
| **1 Sweet** | Board portrait, first impression | ribbed crop top, sundress, off-shoulder knit, ditsy floral cami |
| **2 Flirty** | Gallery, chat photos | bikini, sports bra + leggings, mini skirt, cardigan slipping off over a bralette, satin slip dress |
| **3 Steamy** | Locked / premium photos | lace lingerie set, silk camisole and shorts, satin robe loosely tied, bed-sheet wrap with shoulders bare, towel after a shower |

### Shots
```
PORTRAIT (level 1): waist-up, sitting on a cream bouclé sofa in a sunlit peach room, leaning toward the
camera with forearms on her knees, soft knowing smile, hair falling over one shoulder.

CHIN-ON-HAND (level 1-2): close-up, lying on her stomach on white bedsheets, chin resting on her hand, hair
tousled, morning sun across her face and shoulders, sleepy flirty smile.

OVER-THE-SHOULDER (level 2): seen from behind at three-quarters, looking back over her bare shoulder at the
camera with a teasing smile, low-back top or bikini top, sea or soft room behind her.

MIRROR SELFIE (level 2): full-body mirror selfie in a bright bedroom, holding her phone, one arm raised into
her hair, crop top and mini skirt or matching lounge set, playful pose with one hip popped.

ARM-LENGTH SELFIE (level 1-2): selfie angle from slightly above, lying back on pillows, cami strap slipping,
golden light, flirty eye contact.

BREAKFAST TEASE (level 1-2): at a sunny terrace table with coffee, croissant and strawberries, biting a
strawberry while looking at the camera, off-shoulder knit or cami.

GYM (level 2): bright airy gym with plants and big windows, pastel sports bra and matching leggings,
sitting on a yoga mat or stretching, glowing skin, light sheen of sweat, confident teasing smile.

BEACH / POOL (level 2): golden-hour sun on a Mediterranean terrace or pool edge, bikini, wet hair pushed
back, water droplets on her shoulders, laughing.

SATIN EVENING (level 2-3): satin slip dress in champagne or cherry red, sitting on the edge of a bed in warm
lamplight, one strap off the shoulder, slow seductive smile.

LACE (level 3): lace bralette and matching high-waist briefs in blush, lilac or black, kneeling on rumpled
white bedsheets in soft morning light, hair messy, hand in her hair, intimate eye contact.

SHEET WRAP (level 3): lying in bed wrapped in a white sheet, shoulders and back bare, sheet covering her
body, looking up at the camera with a sleepy, seductive smile, sun through the curtains.

AFTER THE SHOWER (level 3): bathroom with warm light and steam, wrapped in a white towel, wet hair,
droplets on her collarbones, playful smile over her shoulder at the mirror.
```

## 4. Rules block (paste last, every time)

```
She is clearly an adult (21+), confident and consenting. Tasteful and seductive, never explicit: no nudity,
intimate areas always fully covered by clothing, lingerie, a towel or a sheet, no see-through fabric over
intimate areas, no sexual acts. Correct anatomy, five fingers per hand, natural teeth, no extra limbs.
No text, logos, brand names, watermarks or readable signs anywhere in the image.
```

**Negative prompt** (for tools that have a separate field: SDXL, Draw Things, ideal.ai):
```
nude, nipples, explicit, cartoon, anime, 3d render, plastic skin, airbrushed, overexposed, harsh shadows,
dark moody, deformed hands, extra fingers, missing teeth, crossed eyes, watermark, logo, text, child, teen
```

## 5. Contact sheet prompt (several consistent shots in one go)

```
[STYLE BLOCK]
[IDENTITY BLOCK]
Create a photo collage of 6 separate vertical photos of this SAME woman in a 3×2 grid, divided by thin
straight white lines, all from the same day, identical face, hair and body in every frame:
1. [SHOT]  2. [SHOT]  3. [SHOT]  4. [SHOT]  5. [SHOT]  6. [SHOT]
[RULES BLOCK]
```
Cut it apart with `swift scripts/split-collage.swift <collage> <outPrefix>` (finds the white gutters automatically), then upscale each panel
2–4× (Upscayl or Draw Things' Real-ESRGAN) before adding it to the site.

## 6. Ready-to-use identity cards

Hair and look match the current site photos. Ages are on the site; keep them 21+.

| id | Identity block essentials | Accent | Signature props / places |
|---|---|---|---|
| emma | Turkish, Istanbul (Cihangir). Heart-shaped face, warm olive skin, dark brown almond eyes, beauty mark under left eye, long wavy chestnut hair with sun-lightened ends | peach | balcony over the Bosphorus, Turkish coffee, ceramics |
| luna | Norwegian, Oslo. Fair rosy skin, light freckles, grey-blue eyes, soft round face, ash-blonde messy high bun with loose wisps | lilac | harbour at sunset, bookshop, oversized mohair knit |
| anika | British-Punjabi, London. Golden-brown skin, big dark eyes, arched brows, small gold nose stud, long glossy straight black hair | hot pink + marigold | market stalls, chai, gold jhumkas |
| klara | German, Munich. Fair skin, high cheekbones, light hazel eyes, dark-blonde sleek high ponytail, pearl studs | powder blue | sunrise run, dachshund, ballet |
| ece | Turkish, Kadıköy. Light olive skin, deep brown eyes, elegant strong nose, shoulder-length dark wavy hair with a soft fringe, thin gold hoops | terracotta | book-filled window, ferry, second coffee |
| gina | Irish, Dublin. Dense freckles, bright green eyes, crooked mischievous half-smile, long voluminous copper-red curls | coral + turquoise | sea swims at the Forty Foot, vintage shops |
| margot | French, Paris. Pale skin, dark brown eyes, red lipstick, mole on right cheek, glossy black chin-length bob with blunt bangs | cherry red | café terrace, film camera, gallery |
| amara | Nigerian, Lagos. Deep dark-brown glowing skin, high cheekbones, wide confident grin, long knotless braids with gold cuffs | hot coral + gold | rooftop, boxing gym |
| luz | Dominican-American, Bronx. Warm light-brown skin, big dark eyes, red lips, dimple on left cheek, large gold hoops, big dark curly mane | red + turquoise | painted walls, salsa studio |
| katya | Russian, Dubai. Sun-kissed light skin, ice-blue eyes, high cheekbones, teasing raised brow, long sleek honey-blonde hair | champagne | rooftop at sunset, pilates studio |
| jada | African-American, Atlanta. Rich brown skin, round face, deep dimples, warm brown eyes, big natural coily afro, gold studs | peach + leaf green | plant-filled flat, record player, journal |
| valeria | Mexican, Mexico City. Warm tan skin, thick dark brows, bright smile, long dark-brown high ponytail, silver earrings | terracotta + cobalt | cobalt wall, bougainvillea, pottery wheel |
| ines | Spanish, Barcelona. Olive skin, warm brown eyes, strong brows, long voluminous dark-brown curls | turquoise + lilac | bright gym, Barceloneta beach, vermut |
| sofia | Greek, Athens. Light olive skin, warm brown eyes, soft smile, long wavy dark-brown hair, small gold hoops, thin gold chain | blush pink + peach | terrace breakfast, strawberries, sunset sea |

## 7. Full worked example (Sofia, level 3)

```
Photorealistic lifestyle photo, shot like a high-end Instagram influencer editorial on a full-frame camera,
85mm lens, f/1.8, shallow depth of field with creamy background blur. Warm golden-hour sunlight streaming in
from the side, soft glow and gentle bloom around her hair, lifted shadows, bright and airy. Palette: blush
pink, peach and cream, warm and slightly film-like, subtle fine film grain. Glowing dewy sun-kissed skin with
real texture and a natural flush. Playful, flirty, intimate mood, candid like her partner took it.

She is Sofia, a fictional 25-year-old Greek woman from Athens: light olive skin, warm brown eyes, soft
oval face, full lips with a soft smile, long tousled wavy dark-brown hair, small gold hoop earrings and a thin
gold chain, curvy natural figure.

She kneels on rumpled white bedsheets in a sunlit pink-and-cream bedroom, wearing a blush lace bralette and
matching high-waist briefs, one hand in her hair, looking into the lens with a slow, seductive smile.
Vertical 2:3, face sharp.

She is clearly an adult (21+). Tasteful and seductive, never explicit: no nudity, intimate areas fully
covered by the lingerie, no see-through fabric over intimate areas. Correct anatomy, natural hands and teeth.
No text, logos or watermarks.
```

## 8. Adding the result to the site

1. Save files as `public/companions/v2/{id}.jpg` (board portrait) and `{id}-2.jpg`, `{id}-3.jpg`, … (gallery).
2. In `src/lib/companions.ts`: make sure the id is in the `v2` set, and set her gallery count in `shots`.
3. A new girl also needs a companion entry, a line in `bios`, and a chat script in `src/lib/chat-scripts/`
   (copy `sofia.ts`), registered in `chat-scripts/index.ts`.
4. Clear `.next/dev/cache/images` if a replaced photo still shows the old version locally.
