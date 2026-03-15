"use client";

import { motion } from "motion/react";
import { MODEL_OPTIONS, type ModelId } from "@/app/lib/bg-removal";
import { HfTokenInput } from "./hf-token-input";

interface ModelSelectorProps {
    selected: ModelId;
    onChange: (id: ModelId) => void;
    disabled?: boolean;
    hfToken: string | null;
    onHfTokenChange: (token: string | null) => void;
}

export function ModelSelector({ selected, onChange, disabled, hfToken, onHfTokenChange }: ModelSelectorProps) {
    const selectedModel = MODEL_OPTIONS.find((m) => m.id === selected);
    const needsToken = selectedModel?.requiresToken && !hfToken;

    return (
        <div className="flex w-full flex-col items-center gap-2">
            <span className="text-stone text-sm font-light tracking-widest uppercase">Model</span>
            <div className="border-sand bg-base relative flex w-full max-w-lg rounded-full border p-1">
                {/* Animated selection pill */}
                <motion.div
                    className="bg-charcoal shadow-elegant-sm absolute top-1 bottom-1 rounded-full"
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    style={{
                        width: `calc(${100 / MODEL_OPTIONS.length}% - 4px)`,
                        left: `calc(${(MODEL_OPTIONS.findIndex((m) => m.id === selected) * 100) / MODEL_OPTIONS.length}% + 2px)`,
                    }}
                />

                {MODEL_OPTIONS.map((model) => {
                    const isActive = selected === model.id;
                    return (
                        <button
                            key={model.id}
                            onClick={() => onChange(model.id)}
                            disabled={disabled}
                            className={`relative z-10 flex flex-1 flex-col items-center gap-0.5 rounded-full px-3 py-2.5 transition-colors duration-300 ${
                                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                            }`}
                        >
                            <span
                                className="font-semibold"
                                style={{
                                    fontSize: "0.875rem",
                                    color: isActive ? "var(--color-surface)" : "var(--color-charcoal)",
                                }}
                            >
                                {model.name}
                            </span>
                            <span
                                className="hidden font-light sm:inline"
                                style={{
                                    fontSize: "11px",
                                    color: isActive
                                        ? "color-mix(in srgb, var(--color-surface) 70%, transparent)"
                                        : "var(--color-stone)",
                                }}
                            >
                                {model.description}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* HF Token input — shown when a gated model is selected */}
            {selectedModel?.requiresToken && <HfTokenInput token={hfToken} onTokenChange={onHfTokenChange} />}

            {needsToken && (
                <p className="text-bronze/80 text-xs font-light">
                    A token is required before processing with this model
                </p>
            )}
        </div>
    );
}
