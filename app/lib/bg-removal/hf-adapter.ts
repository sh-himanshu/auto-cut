import type { BackgroundRemovalAdapter } from "./types";
import { applyMaskToImage } from "./apply-mask";

export class HuggingFaceAdapter implements BackgroundRemovalAdapter {
    readonly name = "RMBG-1.4 (HuggingFace)";
    readonly description = "High-quality segmentation via RMBG-1.4 transformer model";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private remover: any = null;

    async removeBackground(imageBlob: Blob, onProgress?: (progress: number) => void): Promise<Blob> {
        onProgress?.(0);

        if (!this.remover) {
            const { pipeline, env } = await import("@huggingface/transformers");

            // Disable local model check — always fetch from HuggingFace Hub
            env.allowLocalModels = false;

            onProgress?.(0.1);

            this.remover = await pipeline("image-segmentation", "briaai/RMBG-1.4", {
                device: "webgpu" in (globalThis.navigator ?? {}) ? "webgpu" : "wasm",
                dtype: "q8",
                progress_callback: (p: unknown) => {
                    const info = p as { progress?: number };
                    if (typeof info.progress === "number") {
                        // Model download progress maps to 0.1–0.6
                        onProgress?.(0.1 + (info.progress / 100) * 0.5);
                    }
                },
            });
        }

        onProgress?.(0.65);

        const imageUrl = URL.createObjectURL(imageBlob);

        try {
            const result = await this.remover(imageUrl, {
                threshold: 0,
                return_mask: false,
            });

            onProgress?.(0.9);

            // Result is an array with mask — apply mask to original image as alpha
            const segment = Array.isArray(result) ? result[0] : result;

            if (segment && "mask" in segment && segment.mask) {
                const maskBlob = await segment.mask.toBlob();
                const composited = await applyMaskToImage(imageBlob, maskBlob);
                onProgress?.(1);
                return composited;
            }

            throw new Error("Unexpected result format from RMBG-1.4");
        } finally {
            URL.revokeObjectURL(imageUrl);
        }
    }

    async dispose() {
        if (this.remover && typeof this.remover.dispose === "function") {
            try {
                await this.remover.dispose();
            } catch {
                // Best-effort cleanup
            }
        }
        this.remover = null;
    }
}
