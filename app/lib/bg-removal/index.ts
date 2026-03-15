import type { BackgroundRemovalAdapter, ModelId, ModelOption } from "./types";

export type { BackgroundRemovalAdapter, ModelId, ModelOption } from "./types";

export const MODEL_OPTIONS: ModelOption[] = [
    {
        id: "imgly",
        name: "IMG.LY",
        description: "Fast on-device removal · No external downloads",
    },
    {
        id: "huggingface",
        name: "RMBG-1.4",
        description: "High-quality transformer model · Downloads ~40 MB",
    },
    {
        id: "rmbg2",
        name: "RMBG-2.0",
        description: "Best quality · Gated model · Requires HF token",
        requiresToken: true,
    },
];

const adapterCache = new Map<string, BackgroundRemovalAdapter>();

export async function getAdapter(modelId: ModelId, hfToken?: string): Promise<BackgroundRemovalAdapter> {
    const cacheKey = modelId === "rmbg2" ? `${modelId}:${hfToken ?? ""}` : modelId;
    const cached = adapterCache.get(cacheKey);
    if (cached) return cached;

    let adapter: BackgroundRemovalAdapter;

    switch (modelId) {
        case "imgly": {
            const { ImglyAdapter } = await import("./imgly-adapter");
            adapter = new ImglyAdapter();
            break;
        }
        case "huggingface": {
            const { HuggingFaceAdapter } = await import("./hf-adapter");
            adapter = new HuggingFaceAdapter();
            break;
        }
        case "rmbg2": {
            if (!hfToken) throw new Error("RMBG-2.0 requires a HuggingFace access token");
            const { Rmbg2Adapter } = await import("./rmbg2-adapter");
            adapter = new Rmbg2Adapter(hfToken);
            break;
        }
    }

    adapterCache.set(cacheKey, adapter);
    return adapter;
}
