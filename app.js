// Color Curio - Main Script

// Global color utilities (available everywhere)
const schemeDescriptions = {
    'Analogous': 'Colors next to each other on the color wheel. Creates harmonious, natural-feeling designs perfect for branding and backgrounds.',
    'Complementary': 'Colors directly opposite each other (180°). Maximum contrast for buttons, calls-to-action, and visual pop.',
    'Triadic': 'Three colors evenly spaced (120° apart). Balanced, vibrant combinations great for logos and illustrations.',
    'Tetradic': 'Four colors forming a rectangle. Rich, complex harmonies for detailed designs and multi-section websites.',
    'Monochromatic': 'Variations of one hue (light/dark). Elegant, cohesive look for minimalist, sophisticated brands.',
    'Soft': 'Gentle pastel variations. Perfect for calm UIs, wellness apps, and approachable branding.'
};

// Hex to HSL function
function hexToHSL(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = "0x" + hex[1] + hex[1];
        g = "0x" + hex[2] + hex[2];
        b = "0x" + hex[3] + hex[3];
    } else if (hex.length === 7) {
        r = "0x" + hex[1] + hex[2];
        g = "0x" + hex[3] + hex[4];
        b = "0x" + hex[5] + hex[6];
    }
    r /= 255; g /= 255; b /= 255;

    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;

    let h = 0, s = 0, l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
}


// HSL to hex function (unchanged)
function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    const toHex = v => v.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Generate soft palettes
export function generateSoftPalette(baseColor = '#0066cc') {
    console.log('Generating soft palette from:', baseColor);
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
    console.log('Generating schemes from:', baseColor);
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
                        `<div class="swatch" style="background: ${color}" onclick="window.copyToClipboard(this, '${color}')">
                            <span>${color}</span>
                        </div>`
                    ).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    initColorLabTooltips();
}

function initColorLabTooltips() {
  // Tooltips already work with CSS hover - no JS needed!
    console.log('✅ Color Lab tooltips initialized');
}


/**
 * Global copy-to-clipboard for swatches
 * Used by onclick in generated HTML
 */
window.copyToClipboard = function(element, hexValue) {
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
import './modules/palettes.js';
import './modules/moodboard.js';
import './modules/archive.js';
// ---------- INITIALIZATION ----------

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Color Curio loaded!');
    await window.loadSamplePalettes?.();
    window.loadPalettes?.();
    window.setupLightbox?.();
});
