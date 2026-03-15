export interface ExportSettings {
    format: "png" | "jpeg" | "webp";
    quality: number;
    backgroundColor: string | null;
}

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
    format: "png",
    quality: 0.92,
    backgroundColor: null,
};

export async function exportImage(resultBlob: Blob, settings: ExportSettings): Promise<Blob> {
    // If PNG with no background modification, return as-is
    if (settings.format === "png" && settings.backgroundColor === null) {
        return resultBlob;
    }

    const img = new Image();
    const url = URL.createObjectURL(resultBlob);

    await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image for export"));
        img.src = url;
    });
    URL.revokeObjectURL(url);

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    if (settings.backgroundColor) {
        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);

    const mimeType = `image/${settings.format}`;
    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) resolve(blob);
                else reject(new Error("Failed to export image"));
            },
            mimeType,
            settings.format === "png" ? undefined : settings.quality,
        );
    });
}
