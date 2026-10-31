/**
 * Color Lab - Interactive Harmony Generator
 * Auto-generates palettes when user picks base color!
 * Features: Live harmonies, circle preview, hue slider, auto-palettes
 */

import { hexToHSL, hslToHex } from './colorUtils.js';
import { generateAllSchemes } from '../app.js';

const baseColorInput = document.getElementById('base-color');
const colorCircle = document.querySelector('.color-circle-preview');
const colorRange = document.getElementById('color-range');

// 🔍 Check all required elements exist
if (baseColorInput && colorCircle && colorRange) {

    // 🎨 CIRCLE PREVIEW SYNC
    // Initial sync
    colorCircle.style.background = baseColorInput.value;

    // Live sync on color picker change
    baseColorInput.addEventListener('input', (e) => {
        colorCircle.style.background = e.target.value;
    });

    // 🖼️ DOM ELEMENTS for harmony display
    const colorElements = {
        base: document.getElementById('color-base'),
        complementary: document.getElementById('color-complementary'),
        analogous1: document.getElementById('color-analogous1'),
        analogous2: document.getElementById('color-analogous2')
    };

    const hexElements = {
        base: document.getElementById('hex-base'),
        complementary: document.getElementById('hex-complementary'),
        analogous1: document.getElementById('hex-analogous1'),
        analogous2: document.getElementById('hex-analogous2')
    };

    /**
     * Calculate color harmonies from base hue
     * @param {number} h - Base hue 0-360
     * @returns {Object} Harmony hues
     */
    function calculateHarmonies(h) {
        return {
            complementary: (h + 180) % 360,
            analogous1: (h + 30) % 360,
            analogous2: (h - 30 + 360) % 360
        };
    }

    /**
     * Copy hex code to clipboard with feedback
     */
    function copyToClipboard(hexElement, hexValue) {
        navigator.clipboard
            .writeText(hexValue)
            .then(() => {
                hexElement.textContent = 'Copied!';

                clearTimeout(hexElement.copyTimeout);

                hexElement.copyTimeout = setTimeout(() => {
                    hexElement.textContent = hexValue;
                }, 1200);
            })
            .catch((error) => {
                console.error('Copy failed:', error);
            });
    }

    /**
     * Update all 4 harmony colors in UI
     */
    function updateColors(baseHex) {
        const baseHSL = hexToHSL(baseHex);
        const harmonies = calculateHarmonies(baseHSL.h);

        const colorsToUpdate = [
            {
                name: 'base',
                hex: baseHex,
            },
            {
                name: 'complementary',
                hex: hslToHex(harmonies.complementary, baseHSL.s, baseHSL.l),
            },
            {
                name: 'analogous1',
                hex: hslToHex(harmonies.analogous1, baseHSL.s, baseHSL.l),
            },
            {
                name: 'analogous2',
                hex: hslToHex(harmonies.analogous2, baseHSL.s, baseHSL.l),
            },
        ];

        colorsToUpdate.forEach((color) => {
            const colorElement = colorElements[color.name];
            const hexElement = hexElements[color.name];

            colorElement.style.backgroundColor = color.hex;
            hexElement.textContent = color.hex;

            const copyThisColor = () => copyToClipboard(hexElement, color.hex);

            colorElement.onclick = copyThisColor;
            hexElement.onclick = copyThisColor;
        });
    }

    /**
     * Update colors from hue slider (fixed saturation/lightness)
     */
    function updateFromHue(hue) {
        const hex = hslToHex(hue, 100, 50);
        updateColors(hex);
    }

    /**
     * Auto-generate palettes after color change (debounced)
     */
    let timeoutId;
    function autoGeneratePalettes(baseHex) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            generateAllSchemes(baseHex);
        }, 300); // 300ms delay = smooth UX
    }

    // 🎯 EVENT LISTENERS
    colorRange.addEventListener('input', () => {
        updateFromHue(+colorRange.value);
        autoGeneratePalettes(hslToHex(+colorRange.value, 100, 50));
    });

    baseColorInput.addEventListener('input', (e) => {
        updateColors(e.target.value);
        autoGeneratePalettes(e.target.value);
    });

    // 🚀 INITIALIZE
    updateColors(baseColorInput.value);
    autoGeneratePalettes(baseColorInput.value);
}


