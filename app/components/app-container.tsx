"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useBackgroundRemoval } from "@/app/hooks/use-background-removal";
import { MODEL_OPTIONS } from "@/app/lib/bg-removal";
import { useHaptics } from "@/app/hooks/use-haptics";
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
        retry,
        reset,
        downloadResult,
        copyResult,
    } = useBackgroundRemoval();

    const { success: hapticSuccess, error: hapticError } = useHaptics();
    const prevStatusRef = useRef(status);

    useEffect(() => {
        const prev = prevStatusRef.current;
        prevStatusRef.current = status;
        if (prev !== status) {
            if (status === "done") hapticSuccess();
            if (status === "error") hapticError();
        }
    }, [status, hapticSuccess, hapticError]);

    const isProcessing = status === "loading-model" || status === "processing";
    const modelChanged = status === "done" && processedModelId !== null && modelId !== processedModelId;
    const selectedModel = MODEL_OPTIONS.find((m) => m.id === modelId);
    const needsToken = selectedModel?.requiresToken && !hfToken;

    return (
        <div className="border-surface bg-surface shadow-elegant relative w-full max-w-3xl overflow-hidden rounded-[2rem] border p-4 transition-all duration-500 sm:p-6 md:p-8">
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
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.05 } }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center py-12"
                    >
                        {/* Show original image thumbnail if available */}
                        {originalUrl && (
                            <div className="border-sand/50 mb-6 overflow-hidden rounded-xl border">
                                <img
                                    src={originalUrl}
                                    alt="Original"
                                    className="h-32 w-auto object-contain opacity-60"
                                />
                            </div>
                        )}

                        <p className="text-charcoal mb-3 font-serif text-xl font-medium">Processing Failed</p>
                        <p className="text-stone mb-8 max-w-md text-center text-sm leading-relaxed font-light">
                            {error}
                        </p>
                        <div className="flex items-center gap-3">
                            {originalUrl && (
                                <button
                                    onClick={retry}
                                    className="border-bronze/30 bg-bronze/5 text-bronze hover:border-bronze hover:bg-bronze/10 rounded-full border px-6 py-2.5 text-sm font-light tracking-wide transition-all duration-300"
                                >
                                    Retry
                                </button>
                            )}
                            <button
                                onClick={reset}
                                className="border-sand bg-surface text-stone hover:border-bronze hover:text-charcoal rounded-full border px-6 py-2.5 text-sm font-light tracking-wide transition-all duration-300"
                            >
                                Start Over
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
