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
                const originalText = hexElement.textContent;
                hexElement.textContent = 'Copied!';

                setTimeout(() => {
                    hexElement.textContent = originalText;
                }, 1000);
            })
            .catch((error) => {
                console.error('Copy failed:', error);
            });
            
        const originalText = hexElement.textContent;
        hexElement.textContent = 'Copied!';
        setTimeout(() => {
            hexElement.textContent = originalText;
        }, 1000);
    }

    /**
     * Update all 4 harmony colors in UI
     */
    function updateColors(baseHex) {
        const baseHSL = hexToHSL(baseHex);
        const { complementary, analogous1, analogous2 } = calculateHarmonies(baseHSL.h);

        // Base color
        colorElements.base.style.backgroundColor = baseHex;
        hexElements.base.textContent = baseHex;
        const copyBase = () => copyToClipboard(hexElements.base, baseHex);
        hexElements.base.onclick = copyBase;
        colorElements.base.onclick = copyBase;

        // Complementary
        const compHex = hslToHex(complementary, baseHSL.s, baseHSL.l);
        colorElements.complementary.style.backgroundColor = compHex;
        hexElements.complementary.textContent = compHex;
        const copyComp = () => copyToClipboard(hexElements.complementary, compHex);
        hexElements.complementary.onclick = copyComp;
        colorElements.complementary.onclick = copyComp;

        // Analogous 1
        const analogHex1 = hslToHex(analogous1, baseHSL.s, baseHSL.l);
        colorElements.analogous1.style.backgroundColor = analogHex1;
        hexElements.analogous1.textContent = analogHex1;
        const copyAnalog1 = () => copyToClipboard(hexElements.analogous1, analogHex1);
        hexElements.analogous1.onclick = copyAnalog1;
        colorElements.analogous1.onclick = copyAnalog1;

        // Analogous 2
        const analogHex2 = hslToHex(analogous2, baseHSL.s, baseHSL.l);
        colorElements.analogous2.style.backgroundColor = analogHex2;
        hexElements.analogous2.textContent = analogHex2;
        const copyAnalog2 = () => copyToClipboard(hexElements.analogous2, analogHex2);
        hexElements.analogous2.onclick = copyAnalog2;
        colorElements.analogous2.onclick = copyAnalog2;
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


