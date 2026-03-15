"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Settings2, ChevronDown } from "lucide-react";
import type { ExportSettings } from "@/app/lib/export-image";
import { useHaptics } from "@/app/hooks/use-haptics";

interface OutputOptionsProps {
    settings: ExportSettings;
    onChange: (settings: ExportSettings) => void;
}

const BG_PRESETS: { label: string; value: string | null }[] = [
    { label: "Transparent", value: null },
    { label: "White", value: "#ffffff" },
    { label: "Black", value: "#000000" },
];

const FORMAT_OPTIONS: { label: string; value: ExportSettings["format"] }[] = [
    { label: "PNG", value: "png" },
    { label: "JPEG", value: "jpeg" },
    { label: "WEBP", value: "webp" },
];

export function OutputOptions({ settings, onChange }: OutputOptionsProps) {
    const [expanded, setExpanded] = useState(false);
    const [customColor, setCustomColor] = useState("#4a90d9");
    const { nudge } = useHaptics();

    const isCustomBg =
        settings.backgroundColor !== null && !BG_PRESETS.some((p) => p.value === settings.backgroundColor);

    return (
        <div className="border-sand mt-6 border-t pt-6">
            <button
                onClick={() => {
                    nudge();
                    setExpanded(!expanded);
                }}
                className="text-stone hover:text-charcoal flex items-center gap-2 text-sm font-light transition-colors duration-300"
            >
                <Settings2 className="h-4 w-4" strokeWidth={1.5} />
                Output Options
                <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-3 w-3" />
                </motion.span>
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-5 pt-5">
                            {/* Background Color */}
                            <div>
                                <span className="text-stone mb-2 block text-xs font-light tracking-widest uppercase">
                                    Background
                                </span>
                                <div className="flex flex-wrap items-center gap-2">
                                    {BG_PRESETS.map((preset) => {
                                        const isActive = settings.backgroundColor === preset.value && !isCustomBg;
                                        return (
                                            <button
                                                key={preset.label}
                                                onClick={() => {
                                                    nudge();
                                                    onChange({ ...settings, backgroundColor: preset.value });
                                                }}
                                                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-light transition-all duration-300 ${
                                                    isActive
                                                        ? "border-bronze text-charcoal"
                                                        : "border-sand text-stone hover:border-bronze/50"
                                                }`}
                                            >
                                                <span
                                                    className={`border-sand inline-block h-3 w-3 rounded-full border ${
                                                        preset.value === null
                                                            ? "bg-[conic-gradient(#ccc_25%,#fff_25%_50%,#ccc_50%_75%,#fff_75%)]"
                                                            : ""
                                                    }`}
                                                    style={preset.value ? { backgroundColor: preset.value } : undefined}
                                                />
                                                {preset.label}
                                            </button>
                                        );
                                    })}
                                    {/* Custom color */}
                                    <label
                                        className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-light transition-all duration-300 ${
                                            isCustomBg
                                                ? "border-bronze text-charcoal"
                                                : "border-sand text-stone hover:border-bronze/50"
                                        }`}
                                    >
                                        <input
                                            type="color"
                                            value={customColor}
                                            onChange={(e) => {
                                                setCustomColor(e.target.value);
                                                onChange({ ...settings, backgroundColor: e.target.value });
                                            }}
                                            className="[&::-webkit-color-swatch]:border-sand h-3 w-3 cursor-pointer appearance-none rounded-full border-0 bg-transparent p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch-wrapper]:p-0"
                                        />
                                        Custom
                                    </label>
                                </div>
                            </div>

                            {/* Format */}
                            <div>
                                <span className="text-stone mb-2 block text-xs font-light tracking-widest uppercase">
                                    Format
                                </span>
                                <div className="flex gap-2">
                                    {FORMAT_OPTIONS.map((fmt) => {
                                        const isActive = settings.format === fmt.value;
                                        return (
                                            <button
                                                key={fmt.value}
                                                onClick={() => {
                                                    nudge();
                                                    const newBg =
                                                        fmt.value === "jpeg" && settings.backgroundColor === null
                                                            ? "#ffffff"
                                                            : settings.backgroundColor;
                                                    onChange({
                                                        ...settings,
                                                        format: fmt.value,
                                                        backgroundColor: newBg,
                                                    });
                                                }}
                                                className={`rounded-full border px-4 py-1.5 text-xs font-light transition-all duration-300 ${
                                                    isActive
                                                        ? "border-bronze bg-charcoal text-surface"
                                                        : "border-sand text-stone hover:border-bronze/50 hover:text-charcoal"
                                                }`}
                                            >
                                                {fmt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                {settings.format === "jpeg" && (
                                    <p className="text-stone mt-1.5 text-[10px]">
                                        JPEG doesn&apos;t support transparency — background color applied
                                    </p>
                                )}
                            </div>

                            {/* Quality */}
                            {settings.format !== "png" && (
                                <div>
                                    <span className="text-stone mb-2 block text-xs font-light tracking-widest uppercase">
                                        Quality — {Math.round(settings.quality * 100)}%
                                    </span>
                                    <input
                                        type="range"
                                        min={0.1}
                                        max={1}
                                        step={0.05}
                                        value={settings.quality}
                                        onChange={(e) => onChange({ ...settings, quality: parseFloat(e.target.value) })}
                                        className="bg-sand accent-bronze h-1 w-full max-w-xs cursor-pointer appearance-none rounded-full"
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
