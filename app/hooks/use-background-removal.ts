"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ModelId } from "@/app/lib/bg-removal";
import { exportImage, DEFAULT_EXPORT_SETTINGS, type ExportSettings } from "@/app/lib/export-image";
import { getHfToken, setHfToken, clearHfToken } from "@/app/lib/hf-token";

export type ProcessingStatus = "idle" | "loading-model" | "processing" | "done" | "error";

interface BackgroundRemovalState {
    status: ProcessingStatus;
    progress: number;
    modelId: ModelId;
    processedModelId: ModelId | null;
    originalUrl: string | null;
    resultUrl: string | null;
    error: string | null;
    exportSettings: ExportSettings;
    hfToken: string | null;
}

export function useBackgroundRemoval() {
    const [state, setState] = useState<BackgroundRemovalState>({
        status: "idle",
        progress: 0,
        modelId: "imgly",
        processedModelId: null,
        originalUrl: null,
        resultUrl: null,
        error: null,
        exportSettings: DEFAULT_EXPORT_SETTINGS,
        hfToken: null,
    });

    // Load stored token on mount
    useEffect(() => {
        const stored = getHfToken();
        if (stored) setState((prev) => ({ ...prev, hfToken: stored }));
    }, []);

    const resultBlobRef = useRef<Blob | null>(null);
    const originalFileRef = useRef<File | null>(null);

    const setModel = useCallback((modelId: ModelId) => {
        setState((prev) => ({ ...prev, modelId }));
    }, []);

    const setExportSettings = useCallback((exportSettings: ExportSettings) => {
        setState((prev) => ({ ...prev, exportSettings }));
    }, []);

    const updateHfToken = useCallback((token: string | null) => {
        if (token) setHfToken(token);
        else clearHfToken();
        setState((prev) => ({ ...prev, hfToken: token }));
    }, []);

    const processImage = useCallback(
        async (file: File) => {
            originalFileRef.current = file;

            // Revoke previous URLs
            if (state.originalUrl) URL.revokeObjectURL(state.originalUrl);
            if (state.resultUrl) URL.revokeObjectURL(state.resultUrl);

            const originalUrl = URL.createObjectURL(file);
            setState((prev) => ({
                ...prev,
                status: "loading-model",
                progress: 0,
                originalUrl,
                resultUrl: null,
                error: null,
            }));

            try {
                const { getAdapter } = await import("@/app/lib/bg-removal");
                const adapter = await getAdapter(state.modelId, state.hfToken ?? undefined);

                setState((prev) => ({ ...prev, status: "processing" }));

                const resultBlob = await adapter.removeBackground(file, (progress) => {
                    setState((prev) => ({ ...prev, progress: Math.max(prev.progress, progress) }));
                });

                resultBlobRef.current = resultBlob;
                const resultUrl = URL.createObjectURL(resultBlob);
                setState((prev) => ({
                    ...prev,
                    status: "done",
                    progress: 1,
                    resultUrl,
                    processedModelId: prev.modelId,
                }));
            } catch (err) {
                setState((prev) => ({
                    ...prev,
                    status: "error",
                    error: err instanceof Error ? err.message : "Processing failed",
                }));
            }
        },
        [state.modelId, state.originalUrl, state.resultUrl, state.hfToken],
    );

    const reprocess = useCallback(async () => {
        if (!originalFileRef.current) return;

        if (state.resultUrl) URL.revokeObjectURL(state.resultUrl);

        setState((prev) => ({
            ...prev,
            status: "loading-model",
            progress: 0,
            resultUrl: null,
            error: null,
        }));

        try {
            const { getAdapter } = await import("@/app/lib/bg-removal");
            const adapter = await getAdapter(state.modelId, state.hfToken ?? undefined);

            setState((prev) => ({ ...prev, status: "processing" }));

            const resultBlob = await adapter.removeBackground(originalFileRef.current!, (progress) => {
                setState((prev) => ({ ...prev, progress }));
            });

            resultBlobRef.current = resultBlob;
            const resultUrl = URL.createObjectURL(resultBlob);
            setState((prev) => ({
                ...prev,
                status: "done",
                progress: 1,
                resultUrl,
                processedModelId: prev.modelId,
            }));
        } catch (err) {
            setState((prev) => ({
                ...prev,
                status: "error",
                error: err instanceof Error ? err.message : "Processing failed",
            }));
        }
    }, [state.modelId, state.resultUrl, state.hfToken]);

    const reset = useCallback(() => {
        if (state.originalUrl) URL.revokeObjectURL(state.originalUrl);
        if (state.resultUrl) URL.revokeObjectURL(state.resultUrl);
        resultBlobRef.current = null;
        originalFileRef.current = null;
        setState({
            status: "idle",
            progress: 0,
            modelId: state.modelId,
            processedModelId: null,
            originalUrl: null,
            resultUrl: null,
            error: null,
            exportSettings: DEFAULT_EXPORT_SETTINGS,
            hfToken: state.hfToken,
        });
    }, [state.originalUrl, state.resultUrl, state.modelId, state.hfToken]);

    const downloadResult = useCallback(async () => {
        if (!resultBlobRef.current) return;
        try {
            const exported = await exportImage(resultBlobRef.current, state.exportSettings);
            const url = URL.createObjectURL(exported);
            const a = document.createElement("a");
            a.href = url;
            a.download = `auto-cut-result.${state.exportSettings.format}`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            if (state.resultUrl) {
                const a = document.createElement("a");
                a.href = state.resultUrl;
                a.download = "auto-cut-result.png";
                a.click();
            }
        }
    }, [state.exportSettings, state.resultUrl]);

    const copyResult = useCallback(async () => {
        if (!resultBlobRef.current) return;
        try {
            const copySettings: ExportSettings = { ...state.exportSettings, format: "png" };
            const exported = await exportImage(resultBlobRef.current, copySettings);
            await navigator.clipboard.write([new ClipboardItem({ "image/png": exported })]);
        } catch {
            console.warn("Clipboard write not supported");
        }
    }, [state.exportSettings]);

    return {
        ...state,
        setModel,
        setExportSettings,
        updateHfToken,
        processImage,
        reprocess,
        reset,
        downloadResult,
        copyResult,
    };
}
