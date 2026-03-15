"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, RotateCcw, Copy, Download, RefreshCw } from "lucide-react";
import { OutputOptions } from "./output-options";
import type { ExportSettings } from "@/app/lib/export-image";
import { useHaptics } from "@/app/hooks/use-haptics";

interface ResultViewProps {
    originalUrl: string;
    resultUrl: string;
    onReset: () => void;
    onDownload: () => void;
    onCopy: () => void;
    exportSettings: ExportSettings;
    onExportSettingsChange: (settings: ExportSettings) => void;
    modelChanged: boolean;
    onReprocess: () => void;
    newModelName?: string;
}

export function ResultView({
    originalUrl,
    resultUrl,
    onReset,
    onDownload,
    onCopy,
    exportSettings,
    onExportSettingsChange,
    modelChanged,
    onReprocess,
    newModelName,
}: ResultViewProps) {
    const [copied, setCopied] = useState(false);
    const { success, nudge } = useHaptics();

    const handleCopy = () => {
        onCopy();
        success();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
        >
            {/* Header */}
            <div
                className={`mb-6 flex flex-wrap items-center gap-3 sm:mb-8 sm:flex-row sm:justify-between ${modelChanged ? "flex-col" : "flex-row justify-between"}`}
            >
                <h3 className="text-charcoal flex items-center gap-2 font-serif text-xl font-medium">
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                    >
                        <Check className="h-5 w-5 text-green-500" strokeWidth={1.5} />
                    </motion.span>
                    Complete
                </h3>
                <div className="flex items-center gap-3">
                    {modelChanged && (
                        <motion.button
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => {
                                nudge();
                                onReprocess();
                            }}
                            className="border-bronze/30 bg-bronze/5 text-bronze hover:border-bronze hover:bg-bronze/10 flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-light transition-all duration-300 sm:px-4 sm:text-sm"
                        >
                            <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} />
                            Reprocess{newModelName ? ` with ${newModelName}` : ""}
                        </motion.button>
                    )}
                    <button
                        onClick={() => {
                            nudge();
                            onReset();
                        }}
                        className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-light text-red-600 transition-all duration-300 hover:border-red-500 hover:bg-red-500/20 sm:px-4 sm:text-sm dark:text-red-400"
                    >
                        <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
                        Start Over
                    </button>
                </div>
            </div>

            {/* Image comparison */}
            <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Original */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="flex flex-col"
                >
                    <span className="text-stone mb-3 text-xs font-light tracking-widest uppercase">Original</span>
                    <div className="border-sand bg-charcoal/5 relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border transition-colors duration-500">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={originalUrl} alt="Original" className="max-h-full max-w-full object-contain p-4" />
                    </div>
                </motion.div>

                {/* Result */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col"
                >
                    <span className="text-bronze mb-3 text-xs font-light tracking-widest uppercase">Result</span>
                    <div
                        className={`group border-sand relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border shadow-inner transition-all duration-500 ${
                            exportSettings.backgroundColor === null ? "checkerboard" : ""
                        }`}
                        style={
                            exportSettings.backgroundColor
                                ? { backgroundColor: exportSettings.backgroundColor }
                                : undefined
                        }
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={resultUrl}
                            alt="Result"
                            className="z-10 max-h-full max-w-full object-contain p-4 drop-shadow-md"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Output Options */}
            <OutputOptions settings={exportSettings} onChange={onExportSettingsChange} />

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="border-sand mt-6 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end sm:gap-4 sm:pt-8"
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCopy}
                    className="text-charcoal hover:border-sand hover:bg-charcoal/5 flex items-center justify-center gap-2 rounded-full border border-transparent px-6 py-2.5 font-light transition-all duration-300"
                >
                    {copied ? (
                        <>
                            <Check className="h-4 w-4 text-green-500" strokeWidth={1.5} />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="h-4 w-4" strokeWidth={1.5} />
                            Copy
                        </>
                    )}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        success();
                        onDownload();
                    }}
                    className="btn-elegant bg-charcoal text-surface flex items-center justify-center gap-2 rounded-full px-8 py-2.5 font-light tracking-wide"
                >
                    <Download className="h-4 w-4" strokeWidth={1.5} />
                    Download {exportSettings.format.toUpperCase()}
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
