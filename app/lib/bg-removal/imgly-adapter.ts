import type { BackgroundRemovalAdapter } from "./types";

export class ImglyAdapter implements BackgroundRemovalAdapter {
    readonly name = "@imgly/background-removal";
    readonly description = "Fast on-device background removal powered by IMG.LY";

    private lib: typeof import("@imgly/background-removal") | null = null;

    async removeBackground(imageBlob: Blob, onProgress?: (progress: number) => void): Promise<Blob> {
        if (!this.lib) {
            onProgress?.(0);
            this.lib = await import("@imgly/background-removal");
        }

        const result = await this.lib.removeBackground(imageBlob, {
            progress: (_key: string, current: number, total: number) => {
                if (total > 0) onProgress?.(current / total);
            },
        });

        onProgress?.(1);
        return result;
    }

    dispose() {
        this.lib = null;
    }
}
