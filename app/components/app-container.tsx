"use client";

import { AnimatePresence } from "motion/react";
import { useBackgroundRemoval } from "@/app/hooks/use-background-removal";
import { MODEL_OPTIONS } from "@/app/lib/bg-removal";
import { ModelSelector } from "./model-selector";
import { Dropzone } from "./dropzone";
import { ProcessingView } from "./processing-view";
import { ResultView } from "./result-view";

export function AppContainer() {
    const {
        status,
        progress,
        modelId,
        processedModelId,
        originalUrl,
        resultUrl,
        error,
        exportSettings,
        hfToken,
        setModel,
        setExportSettings,
        updateHfToken,
        processImage,
        reprocess,
        reset,
        downloadResult,
        copyResult,
    } = useBackgroundRemoval();

    const isProcessing = status === "loading-model" || status === "processing";
    const modelChanged = status === "done" && processedModelId !== null && modelId !== processedModelId;
    const selectedModel = MODEL_OPTIONS.find((m) => m.id === modelId);
    const needsToken = selectedModel?.requiresToken && !hfToken;

    return (
        <div className="border-surface bg-surface shadow-elegant relative w-full max-w-3xl overflow-hidden rounded-[2rem] border p-2 transition-all duration-500 md:p-8">
            {/* Model Selector — always visible */}
            <div className="mb-6">
                <ModelSelector
                    selected={modelId}
                    onChange={setModel}
                    disabled={isProcessing}
                    hfToken={hfToken}
                    onHfTokenChange={updateHfToken}
                />
            </div>

            {/* Animated view transitions */}
            <AnimatePresence mode="wait">
                {status === "idle" && <Dropzone key="upload" onFileSelected={processImage} disabled={needsToken} />}

                {isProcessing && (
                    <ProcessingView
                        key="processing"
                        progress={progress}
                        status={status as "loading-model" | "processing"}
                    />
                )}

                {status === "done" && originalUrl && resultUrl && (
                    <ResultView
                        key="result"
                        originalUrl={originalUrl}
                        resultUrl={resultUrl}
                        onReset={reset}
                        onDownload={downloadResult}
                        onCopy={copyResult}
                        exportSettings={exportSettings}
                        onExportSettingsChange={setExportSettings}
                        modelChanged={modelChanged}
                        onReprocess={reprocess}
                        newModelName={modelChanged ? MODEL_OPTIONS.find((m) => m.id === modelId)?.name : undefined}
                    />
                )}

                {status === "error" && (
                    <div key="error" className="flex flex-col items-center py-16">
                        <p className="text-charcoal mb-4 font-serif text-xl font-medium">Something went wrong</p>
                        <p className="text-stone mb-8 text-sm font-light">{error}</p>
                        <button
                            onClick={reset}
                            className="btn-elegant bg-charcoal text-surface rounded-full px-8 py-3 font-light tracking-wide"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
