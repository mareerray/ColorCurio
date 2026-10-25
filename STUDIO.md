# Studio

Studio is the part of ColorCurio where a color palette becomes something visual.

Instead of only showing color swatches, Studio lets you preview one palette in
different real-life contexts, such as a landscape wallpaper, a web page, a
poster, or a simple brand card.

The goal is simple:

> Choose a palette → choose a preview → see how the colors work together →
> download the result.

## Why Studio exists

A palette can look nice as five separate swatches, but that does not always
tell us whether it works in a real design.

For example, a palette may have beautiful colors, but:

- The text may be hard to read on the background.
- The accent color may not stand out enough.
- The colors may feel too similar in a landscape.
- The palette may work well for a poster but not for a website.

Studio helps answer these questions by applying the same palette to simple,
ready-made design previews.

This follows a common design idea: colors should have roles, not just exist as
a list. A design usually needs a background or surface color, main accent
colors, supporting colors, and sometimes a small extra accent.

## Palette data source

Studio loads its curated palettes from:

```text
assets/palettes/samplePalettes.studio.json
```

The file contains an array of palette objects. Each object has a name and
five colors ordered by design role.

The data is loaded in `modules/studio.js`:

```js
const response = await fetch("./assets/palettes/samplePalettes.studio.json");
```

Archive and Studio should use the same curated palette file to avoid
maintaining duplicate copies.

## Palette structure

Every Studio palette should have exactly five colors.

The colors are stored in a fixed order. Studio uses that order to decide which
color is used for each part of a preview.

| Position | General role | Purpose |
|---:|---|---|
| 1 | Base | The main background or largest calm area |
| 2 | Accent | The main eye-catching color |
| 3 | Support | A softer supporting color |
| 4 | Deep support | A stronger or darker supporting color |
| 5 | Extra | A small detail, optional element, or secondary accent |

### Example

```json
{
  "name": "Soft Meadow",
  "colors": [
    "#FFF7ED",
    "#F3D68A",
    "#A8C5AE",
    "#789C83",
    "#5C7A66"
  ]
}
```

In this palette:

- `#FFF7ED` is the base/background.
- `#F3D68A` is the accent.
- `#A8C5AE` is the support color.
- `#789C83` is the deep support color.
- `#5C7A66` is the extra color.

## Palette rules

To keep Studio simple and predictable:

1. Every palette has exactly five colors.
2. Colors are ordered by design role, not alphabetically.
3. The first color is usually light, calm, or neutral enough for a background.
4. The second color should be able to work as an accent.
5. Colors three and four should create depth or contrast.
6. The fifth color is flexible and can be used for small details.

The curated palettes used by Studio should contain exactly five colors,
ordered by role. Palette names are sorted alphabetically; colors within each
palette are not.

Studio currently includes a fallback for a missing fifth color: it reuses the
accent color. This is a defensive fallback, not the intended palette format.

Normalizing all curated palettes to five colors remains a data-maintenance
task until the JSON has been reviewed.

## Preview types

Studio has four preview templates. Each uses the same five-color palette,
but applies the colors to different design elements.

Text is currently represented by rectangular placeholder shapes rather than
real headings and paragraphs.

| Preview | What it shows | Intended use |
|---|---|---|
| Landscape | Sky, sun, two layers of hills, and clouds | Wallpaper and illustration ideas |
| Web page | Background, card, text blocks, button, and badge | Website and app color exploration |
| Poster | Background, focal circle, title blocks, subtitle, and footer detail | Poster and social graphic ideas |
| Brand card | Background, card surface, logo mark, text blocks, and decorative detail | Simple branding ideas |

## Shared color roles

| Palette role | Landscape | Web page | Poster | Brand card |
|---|---|---|---|---|
| Base | Sky | Page background | Poster background | Outer background |
| Accent | Sun | Primary button | Focal circle | Logo mark |
| Support | Back hills | Card background | Subtitle lines | Card surface |
| Deep support | Front hills | Heading and body lines | Title blocks | Brand name and tagline |
| Extra | Clouds | Badge | Footer detail | Decorative detail |

All five roles are represented in each template.

The mappings are starting points for visual exploration. They do not
guarantee that every palette will produce a readable or balanced design.
The current previews do not perform automated contrast checks.

## UI concept

### Desktop

Studio has two main areas:

```text
+----------------------+--------------------------------+
| Studio controls      | Preview                        |
|                      |                                |
| - Palette list       | - Preview type selector        |
| - Format information | - Selected SVG preview         |
| - Download link      | - Preview caption              |
+----------------------+--------------------------------+
```

The palette list scrolls independently and has a maximum height of 320px.

Wide previews, such as Web page and Brand, use more horizontal space than
portrait previews.

### Mobile

The preview appears above the controls.

The preview panel stays sticky while the user browses the palettes below.
Landscape and Poster use smaller display sizes to leave room for the controls.

The preview heading and caption are hidden on mobile to save space.
The preview-type selector remains visible.

### Current interactions

- Selecting a palette recolors the active SVG.
- Switching preview types keeps the selected palette.
- The selected palette and preview buttons have visible active states.

### Planned interactions

- Choosing an export format.
- Showing or hiding optional elements.
- Downloading the currently selected, recolored SVG.


## Preview type selector

The preview type selector should be simple button tabs:

```html
<div class="studio-preview-types" role="group" aria-label="Preview type">
  <button
    type="button"
    class="studio-preview-type is-selected"
    data-preview="landscape"
  >
    Landscape
  </button>

  <button
    type="button"
    class="studio-preview-type"
    data-preview="web"
  >
    Web page
  </button>

  <button
    type="button"
    class="studio-preview-type"
    data-preview="poster"
  >
    Poster
  </button>

  <button
    type="button"
    class="studio-preview-type"
    data-preview="brand"
  >
    Brand
  </button>
</div>
```

Only one preview type can be selected at a time.

The selected button should have a clear active style, using the same accent
color and focus style as the rest of ColorCurio.

## SVG template idea

Each preview is stored as a separate SVG file.

For example:

```text
assets/
└── previews/
    ├── landscape.svg
    ├── web-page.svg
    ├── poster.svg
    └── brand-card.svg
```

Inside each SVG, important parts should have IDs so JavaScript can change
their colors.

Example:

```svg
<g id="preview-base"></g>
<g id="preview-accent"></g>
<g id="preview-support"></g>
<g id="preview-deep"></g>
<g id="preview-extra"></g>
```

JavaScript can then apply the palette like this:

```js
const roles = {
  base: palette.colors[0],
  accent: palette.colors[1],
  support: palette.colors[2],
  deep: palette.colors[3],
  extra: palette.colors[4] || palette.colors[1]
};
```
Templates are loaded into `#studio-preview` as inline SVG.

A role ID can belong to a single shape or a group of shapes. For groups,
child shapes should inherit the group's fill where possible. The current
palette function also updates descendants with explicit fill attributes.

Each role ID should appear only once within a template.

## Download behavior

At first, the download button can download the original SVG template.

Later, when the user selects a palette, Studio should generate a customized
SVG in the browser and download that version.

The download name can include the preview type and palette name:

```text
colorcurio-landscape-soft-meadow.svg
colorcurio-web-page-sunset-vibes.svg
```

## Design principles

Studio should stay:

- **Simple:** one palette, one preview, one clear result.
- **Visual:** show colors in context, not only as swatches.
- **Consistent:** use the same five palette roles everywhere.
- **Flexible:** allow different preview types without changing the palette format.
- **Calm:** match ColorCurio’s cozy, friendly visual style.

## Implementation status

### Implemented

- [x] Studio controls and preview layout.
- [x] Scrollable palette list.
- [x] Palette selection and active styling.
- [x] Preview-type switching.
- [x] Inline SVG loading.
- [x] Five-role color mapping.
- [x] Landscape template with clouds.
- [x] Web page template.
- [x] Poster template.
- [x] Brand card template.
- [x] Responsive preview sizing.
- [x] Compact, sticky mobile preview.
- [x] Static SVG download link.

### Remaining work

- [ ] Review and normalize all curated palettes to exactly five role-ordered colors.
- [ ] Export the selected, recolored SVG.
- [ ] Update download names to include the preview and palette.
- [ ] Add format selection.
- [ ] Add optional element controls.
- [ ] Improve preview text and contrast feedback.