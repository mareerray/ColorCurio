// Color Curio - Wallpaper Studio

import { loadPalettes, getPalettes } from './paletteData.js';

let selectedPalette = null;
let currentPreview = "landscape";

const previewTypes = {
    landscape: {
        file: "./assets/previews/landscape.svg",
        caption: "A quiet little landscape, made with color."
    },
    web: {
        file: "./assets/previews/web-page.svg",
        caption: "See your palette as a calm little web page."
    },
    poster: {
        file: "./assets/previews/poster.svg",
        caption: "Turn your palette into a bold little poster."
    },
    brand: {
        file: "./assets/previews/brand-card.svg",
        caption: "Preview your palette as a small brand card."
    }
};

async function loadStudioPalettes() {
    const paletteList = document.querySelector('#studio-palette-list');

    if (!paletteList) return;

    try {
        const palettes = await loadPalettes();
        renderStudioPalettes(palettes);
    } catch (error) {
        console.error(error);
        paletteList.innerHTML = '<p>Sorry, palettes could not load.</p>';
    }
}

function renderStudioPalettes(palettes) {
    const paletteList = document.querySelector("#studio-palette-list");

    if (!paletteList) return;

    paletteList.innerHTML = palettes
        .map((palette, index) => {
            const colors = palette.colors
                .map(
                    (color) =>
                        `<span style="--swatch-color: ${color};"></span>`
                )
                .join("");

            return `
        <button
            class="studio-palette-option"
            type="button"
            data-palette-index="${index}"
            aria-label="Use ${palette.name} palette"
            >
            <span class="studio-palette-name">${palette.name}</span>
            <span class="studio-palette">${colors}</span>
            </button>
        `;
        })
        .join("");

    paletteList.addEventListener("click", handlePaletteClick);
}

function handlePaletteClick(event) {
    const button = event.target.closest(".studio-palette-option");

    if (!button) return;

    document
        .querySelectorAll(".studio-palette-option")
        .forEach((option) => option.classList.remove("is-selected"));

    button.classList.add("is-selected");

    const index = Number(button.dataset.paletteIndex);
    selectedPalette = getPalettes()[index];

    applyPaletteToPreview();
}

function downloadCurrentSvg() {
    const svg = document.querySelector("#studio-preview svg");

    if (!svg) return;

    // 1. Turn the SVG on screen into text
    const svgText = new XMLSerializer().serializeToString(svg);

    // 2. Put the text into a file-like object
    const blob = new Blob([svgText], { type: "image/svg+xml" });

    // 3. Make a temporary link to that file
    const url = URL.createObjectURL(blob);

    // 4. Build a good file name
    const paletteName = selectedPalette
        ? selectedPalette.name.toLowerCase().replace(/\s+/g, "-")
        : "original";
    const fileName = `colorcurio-${currentPreview}-${paletteName}.svg`;

    // 5. Click an invisible link to start the download
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    // 6. Clean up
    URL.revokeObjectURL(url);
}

document
    .querySelector("#download-wallpaper")
    ?.addEventListener("click", downloadCurrentSvg);

function initPreviewTypes() {
    const buttons = document.querySelectorAll(".studio-preview-type");

    if (!buttons.length) return;

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const previewName = button.dataset.preview;
            const preview = previewTypes[previewName];

            if (!preview) return;

            currentPreview = previewName;

            buttons.forEach((item) =>
                item.classList.remove("is-selected")
            );

            button.classList.add("is-selected");

            showPreview(previewName);
        });
    });

    showPreview(currentPreview);
}

async function showPreview(previewName) {
    const preview = previewTypes[previewName];
    const container = document.querySelector("#studio-preview");
    const caption = document.querySelector("#studio-preview-caption");

    if (!preview || !container || !caption) return;

    try {
        const response = await fetch(preview.file);

        if (!response.ok) {
            throw new Error(`Could not load preview: ${response.status}`);
        }

        const svgText = await response.text();

        container.innerHTML = svgText;
        container.dataset.preview = previewName;
        caption.textContent = preview.caption;

        applyPaletteToPreview();
    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Sorry, this preview could not load.</p>";
    }
}

function applyPaletteToPreview() {
    if (!selectedPalette) return;

    const colors = selectedPalette.colors;

    const colorMap = {
        "preview-base": colors[0],
        "preview-accent": colors[1],
        "preview-support": colors[2],
        "preview-deep": colors[3],
        "preview-extra": colors[4] || colors[1]
    };

    Object.entries(colorMap).forEach(([id, color]) => {
        const element = document.querySelector(`#studio-preview #${id}`);

        if (!element) return;

        element.setAttribute("fill", color);

        element.querySelectorAll("[fill]").forEach((shape) => {
            shape.setAttribute("fill", color);
        });
    });
}

initPreviewTypes();
loadStudioPalettes();