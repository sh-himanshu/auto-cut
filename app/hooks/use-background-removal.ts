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

function revokeUrl(url: string | null) {
    if (url) URL.revokeObjectURL(url);
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
    // Track URLs in refs so callbacks don't depend on state URLs
    const originalUrlRef = useRef<string | null>(null);
    const resultUrlRef = useRef<string | null>(null);

    // Keep refs in sync with state
    useEffect(() => {
        originalUrlRef.current = state.originalUrl;
    }, [state.originalUrl]);

    useEffect(() => {
        resultUrlRef.current = state.resultUrl;
    }, [state.resultUrl]);

    // Cleanup blob URLs on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            revokeUrl(originalUrlRef.current);
            revokeUrl(resultUrlRef.current);
        };
    }, []);

    const setModel = useCallback((modelId: ModelId) => {
        setState((prev) =>
            prev.status === "error" ? { ...prev, modelId, status: "idle", error: null } : { ...prev, modelId },
        );
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

            // Revoke previous URLs via refs (avoids stale closure)
            revokeUrl(originalUrlRef.current);
            revokeUrl(resultUrlRef.current);

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
                // Revoke the originalUrl we just created on failure
                revokeUrl(originalUrl);
                setState((prev) => ({
                    ...prev,
                    status: "error",
                    originalUrl: null,
                    error: err instanceof Error ? err.message : "Processing failed",
                }));
            }
        },
        [state.modelId, state.hfToken],
    );

    const reprocess = useCallback(async () => {
        if (!originalFileRef.current) return;

        revokeUrl(resultUrlRef.current);

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
    }, [state.modelId, state.hfToken]);

    const reset = useCallback(() => {
        revokeUrl(originalUrlRef.current);
        revokeUrl(resultUrlRef.current);
        resultBlobRef.current = null;
        originalFileRef.current = null;
        setState((prev) => ({
            status: "idle",
            progress: 0,
            modelId: prev.modelId,
            processedModelId: null,
            originalUrl: null,
            resultUrl: null,
            error: null,
            exportSettings: DEFAULT_EXPORT_SETTINGS,
            hfToken: prev.hfToken,
        }));
    }, []);

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
            const fallbackUrl = resultUrlRef.current;
            if (fallbackUrl) {
                const a = document.createElement("a");
                a.href = fallbackUrl;
                a.download = "auto-cut-result.png";
                a.click();
            }
        }
    }, [state.exportSettings]);

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
