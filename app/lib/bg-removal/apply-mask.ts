/**
 * Applies a segmentation mask to the original image as an alpha channel,
 * producing a transparent-background PNG.
 */
export async function applyMaskToImage(originalBlob: Blob, maskBlob: Blob): Promise<Blob> {
    const [origImg, maskImg] = await Promise.all([loadImage(originalBlob), loadImage(maskBlob)]);

    const canvas = document.createElement("canvas");
    canvas.width = origImg.naturalWidth;
    canvas.height = origImg.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    // Draw original image
    ctx.drawImage(origImg, 0, 0);

    // Get original pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Draw mask scaled to same dimensions
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) throw new Error("Canvas context not available");
    maskCtx.drawImage(maskImg, 0, 0, canvas.width, canvas.height);
    const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height).data;

    // Apply mask: use the mask's luminance as the alpha channel
    for (let i = 0; i < pixels.length; i += 4) {
        // Use the red channel of the mask as alpha (mask is grayscale)
        pixels[i + 3] = maskData[i];
    }

    ctx.putImageData(imageData, 0, 0);

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("Failed to create result image"))),
            "image/png",
        );
    });
}

function loadImage(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load image"));
        };
        img.src = url;
    });
}
