// ColorCurio - Shared palette data loader

let palettes = [];
let loadPromise = null;

export function loadPalettes() {
    if (loadPromise) {
        return loadPromise;
    }

    loadPromise = fetch('./assets/palettes/samplePalettes.studio.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Could not load palettes: ${response.status}`);
            }

            return response.json();
        })
        .then((data) => {
            palettes = data;
            return palettes;
        })
        .catch((error) => {
            console.error('Could not load palettes:', error);
            loadPromise = null;
            throw error;
        });

    return loadPromise;
}

export function getPalettes() {
    return palettes;
}