// Color Curio - Main Script

import { hexToHSL, hslToHex } from './modules/colorUtils.js';

// Global color utilities (available everywhere)
const schemeDescriptions = {
    'Analogous': 'Colors next to each other on the color wheel. Creates harmonious, natural-feeling designs perfect for branding and backgrounds.',
    'Complementary': 'Colors directly opposite each other (180°). Maximum contrast for buttons, calls-to-action, and visual pop.',
    'Triadic': 'Three colors evenly spaced (120° apart). Balanced, vibrant combinations great for logos and illustrations.',
    'Tetradic': 'Four colors forming a rectangle. Rich, complex harmonies for detailed designs and multi-section websites.',
    'Monochromatic': 'Variations of one hue (light/dark). Elegant, cohesive look for minimalist, sophisticated brands.',
    'Soft': 'Gentle pastel variations. Perfect for calm UIs, wellness apps, and approachable branding.'
};

// Generate soft palettes
export function generateSoftPalette(baseColor = '#0066cc') {
    const hsl = hexToHSL(baseColor);
    const baseHue = hsl.h;

    return [
        hslToHex(baseHue, hsl.s * 0.5, hsl.l * 0.9),
        hslToHex((baseHue + 30) % 360, hsl.s * 0.4, hsl.l * 0.85),
        hslToHex((baseHue - 30 + 360) % 360, hsl.s * 0.4, hsl.l * 0.85),
        hslToHex((baseHue + 180) % 360, hsl.s * 0.3, hsl.l * 0.88),
        hslToHex(baseHue, hsl.s * 0.6, hsl.l * 0.95)
    ];
}

export function generateAllSchemes(baseColor = '#0066cc') {
    const hsl = hexToHSL(baseColor);
    const baseHue = hsl.h;

    const schemes = {
        'Analogous': [
            baseColor,
            hslToHex((baseHue + 30) % 360, hsl.s, hsl.l),
            hslToHex((baseHue - 30 + 360) % 360, hsl.s, hsl.l),
            hslToHex(baseHue, hsl.s * 0.8, hsl.l * 1.1)
        ],
        'Complementary': [
            baseColor,
            hslToHex((baseHue + 180) % 360, hsl.s, hsl.l)
        ],
        'Triadic': [
            baseColor,
            hslToHex((baseHue + 120) % 360, hsl.s, hsl.l),
            hslToHex((baseHue + 240) % 360, hsl.s, hsl.l)
        ],
        'Tetradic': [
            baseColor,
            hslToHex((baseHue + 90) % 360, hsl.s, hsl.l),
            hslToHex((baseHue + 180) % 360, hsl.s, hsl.l),
            hslToHex((baseHue + 270) % 360, hsl.s, hsl.l)
        ],
        'Monochromatic': [
            baseColor,
            hslToHex(baseHue, hsl.s * 0.7, hsl.l * 0.7),
            hslToHex(baseHue, hsl.s * 0.5, hsl.l * 0.5),
            hslToHex(baseHue, hsl.s * 0.3, hsl.l * 1.2)
        ],
        'Soft': generateSoftPalette(baseColor)
    };

    displayAllSchemes(schemes);
}

export function displayAllSchemes(schemes) {
    const container = document.getElementById('paletteSwatches');
    if (!container) return;

    container.innerHTML = Object.entries(schemes).map(([name, colors]) => {
        container.addEventListener('click', (event) => {
            const swatch = event.target.closest('.swatch');
            if (!swatch) return;

            const color = swatch.dataset.color;
            window.copyToClipboard(swatch, color);
        });
        
        const tooltip = schemeDescriptions[name] || 'Color harmony scheme';
        return `
            <div class="scheme-row">
                <div class="scheme-header">
                    <h4>${name}</h4>
                    <div class="info-tooltip" data-tooltip="${tooltip}">
                        <button class="info-btn" aria-label="${name} info">
                            <i class="bi bi-info-circle"></i>
                        </button>
                        <span class="tooltip-text">${tooltip}</span>
                    </div>
                </div>
                <div class="scheme-swatches">
                    ${colors.map(color =>
            `<button
                        type="button"
                        class="swatch"
                        style="background: ${color}"
                        data-color="${color}"
                        aria-label="Copy ${color}"
                    >
                        <span>${color}</span>
                    </button>`
        ).join('')}
                </div>
            </div>
        `;
    }).join('');

    initColorLabTooltips();
}

function initColorLabTooltips() {
    // Tooltips already work with CSS hover - no JS needed!
}

async function loadStudioIllustration() {
    const container = document.querySelector("#studio-illustration");

    if (!container) return;

    try {
        const response = await fetch("./assets/illustrations/art-studio.svg");

        if (!response.ok) {
            throw new Error(`Could not load illustration: ${response.status}`);
        }

        const svg = await response.text();
        container.innerHTML = svg;
    } catch (error) {
        console.error(error);
    }
}

loadStudioIllustration();


/**
 * Global copy-to-clipboard for swatches
 * Used by onclick in generated HTML
 */
window.copyToClipboard = function (element, hexValue) {
    navigator.clipboard.writeText(hexValue).then(() => {
        // Show "Copied!" feedback
        const span = element.querySelector('span');
        if (span) {
            const originalText = span.textContent;
            span.textContent = 'Copied!';
            setTimeout(() => {
                span.textContent = originalText;
            }, 1000);
        }
    }).catch(err => {
        console.error('Copy failed:', err);
        // Fallback: select text
        const textArea = document.createElement('textarea');
        textArea.value = hexValue;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    });
};



// Make global
window.hexToHSL = hexToHSL;
window.hslToHex = hslToHex;
window.generateSoftPalette = generateSoftPalette;
window.generateAllSchemes = generateAllSchemes;
window.displayAllSchemes = displayAllSchemes;

// Load all modules
import './modules/layout.js';
import './modules/home.js';
import './modules/colorlab.js';
import './modules/studio.js';
import './modules/moodboard.js';
import './modules/palettes.js';
// ---------- INITIALIZATION ----------

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
    await window.loadSamplePalettes?.();
    window.loadPalettes?.();
    window.setupLightbox?.();
});
