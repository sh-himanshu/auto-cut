import type { BackgroundRemovalAdapter } from "./types";
import { applyMaskToImage } from "./apply-mask";

export class Rmbg2Adapter implements BackgroundRemovalAdapter {
    readonly name = "RMBG-2.0 (HuggingFace)";
    readonly description = "Best-quality segmentation via RMBG-2.0 gated transformer model";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private remover: any = null;

    constructor(private readonly accessToken: string) {}

    async removeBackground(imageBlob: Blob, onProgress?: (progress: number) => void): Promise<Blob> {
        onProgress?.(0);

        if (!this.remover) {
            const { pipeline, env } = await import("@huggingface/transformers");

            env.allowLocalModels = false;
            // Set access token for gated model access
            (env as Record<string, unknown>).accessToken = this.accessToken;

            onProgress?.(0.1);

            this.remover = await pipeline("image-segmentation", "briaai/RMBG-2.0", {
                device: "webgpu" in (globalThis.navigator ?? {}) ? "webgpu" : "wasm",
                dtype: "q8",
                progress_callback: (p: unknown) => {
                    const info = p as { progress?: number };
                    if (typeof info.progress === "number") {
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

            const segment = Array.isArray(result) ? result[0] : result;

            if (segment && "mask" in segment && segment.mask) {
                const maskBlob = await segment.mask.toBlob();
                const composited = await applyMaskToImage(imageBlob, maskBlob);
                onProgress?.(1);
                return composited;
            }

            throw new Error("Unexpected result format from RMBG-2.0");
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
