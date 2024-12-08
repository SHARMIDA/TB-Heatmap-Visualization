const imageInput = document.getElementById('imageInput');
const originalCanvas = document.getElementById('originalCanvas');
const heatmapCanvas = document.getElementById('heatmapCanvas');

const originalCtx = originalCanvas.getContext('2d');
const heatmapCtx = heatmapCanvas.getContext('2d');

// Load and process the image
imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        // Draw original image on canvas
        originalCtx.drawImage(img, 0, 0, originalCanvas.width, originalCanvas.height);

        // Apply grayscale effect
        const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        const data = imageData.data;

        // Convert to grayscale
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;     // Red
            data[i + 1] = avg; // Green
            data[i + 2] = avg; // Blue
        }
        originalCtx.putImageData(imageData, 0, 0);

        // Generate heatmap
        createHeatmap(imageData);
    };
});

function createHeatmap(imageData) {
    const data = imageData.data;
    const heatmapData = heatmapCtx.createImageData(imageData);

    for (let i = 0; i < data.length; i += 4) {
        const intensity = data[i]; // Grayscale value
        if (intensity > 100) {
            // Apply heatmap colors (based on intensity)
            heatmapData.data[i] = intensity;      // Red
            heatmapData.data[i + 1] = 0;          // Green
            heatmapData.data[i + 2] = 255 - intensity; // Blue
            heatmapData.data[i + 3] = 255;        // Alpha
        } else {
            heatmapData.data[i] = data[i];
            heatmapData.data[i + 1] = data[i + 1];
            heatmapData.data[i + 2] = data[i + 2];
            heatmapData.data[i + 3] = data[i + 3];
        }
    }
    heatmapCtx.putImageData(heatmapData, 0, 0);
}

