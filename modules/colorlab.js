/**
 * Color Lab - Interactive Harmony Generator
 * Auto-generates palettes when user picks base color!
 * Features: Live harmonies, circle preview, hue slider, auto-palettes
 */

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
    
    // 🔄 COLOR CONVERSION FUNCTIONS
    
    /**
     * Convert HEX to HSL
     * @param {string} hex - #RRGGBB or #RGB format
     * @returns {Object} {h: 0-360, s: 0-100, l: 0-100}
     */
    function hexToHSL(hex) {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16) / 255;
            g = parseInt(hex[2] + hex[2], 16) / 255;
            b = parseInt(hex[3] + hex[3], 16) / 255;
        } else if (hex.length === 7) {
            r = parseInt(hex.slice(1, 3), 16) / 255;
            g = parseInt(hex.slice(3, 5), 16) / 255;
            b = parseInt(hex.slice(5, 7), 16) / 255;
        }
        
        const cmin = Math.min(r, g, b);
        const cmax = Math.max(r, g, b);
        const delta = cmax - cmin;
        
        let h = 0;
        if (delta === 0) h = 0;
        else if (cmax === r) h = ((g - b) / delta) % 6;
        else if (cmax === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;
        
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        
        const l = (cmax + cmin) / 2;
        const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        
        return {
            h: h,
            s: +(s * 100).toFixed(1),
            l: +(l * 100).toFixed(1)
        };
    }
    
    /**
     * Convert HSL to HEX
     * @param {number} h - Hue 0-360
     * @param {number} s - Saturation 0-100
     * @param {number} l - Lightness 0-100
     * @returns {string} #RRGGBB
     */
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
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
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
        navigator.clipboard.writeText(hexValue);
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
            if (window.generateAllSchemes) {
                window.generateAllSchemes(baseHex);
                console.log('🎨 Auto-generated palettes from:', baseHex);
            }
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
    console.log('✅ Color Lab initialized! Pick a color → watch magic!');
}

// 🌍 GLOBAL EXPORTS (for app.js functions)
window.generateAllSchemes = window.generateAllSchemes || (() => console.log('generateAllSchemes ready'));
window.generateSoftPalette = window.generateSoftPalette || (() => console.log('generateSoftPalette ready'));
window.displayAllSchemes = window.displayAllSchemes || (() => console.log('displayAllSchemes ready'));

