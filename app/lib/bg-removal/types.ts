export interface BackgroundRemovalAdapter {
    readonly name: string;
    readonly description: string;
    removeBackground(imageBlob: Blob, onProgress?: (progress: number) => void): Promise<Blob>;
    dispose?(): void | Promise<void>;
}

export type ModelId = "imgly" | "huggingface" | "rmbg2";

export interface ModelOption {
    id: ModelId;
    name: string;
    description: string;
    requiresToken?: boolean;
}
