"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { KeyRound, Eye, EyeOff, ExternalLink, X, Check } from "lucide-react";

interface HfTokenInputProps {
    token: string | null;
    onTokenChange: (token: string | null) => void;
}

export function HfTokenInput({ token, onTokenChange }: HfTokenInputProps) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState("");
    const [showToken, setShowToken] = useState(false);

    const hasToken = !!token;

    const handleSave = () => {
        const trimmed = draft.trim();
        if (trimmed) {
            onTokenChange(trimmed);
            setDraft("");
            setEditing(false);
        }
    };

    const handleRemove = () => {
        onTokenChange(null);
        setDraft("");
        setEditing(false);
    };

    if (hasToken && !editing) {
        return (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 flex items-center gap-2"
            >
                <KeyRound className="text-bronze h-3.5 w-3.5" strokeWidth={1.5} />
                <span className="text-stone text-xs font-light">
                    Token: {showToken ? token : `${"•".repeat(8)}${token.slice(-4)}`}
                </span>
                <button onClick={() => setShowToken(!showToken)} className="text-stone hover:text-charcoal">
                    {showToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </button>
                <button onClick={handleRemove} className="text-stone hover:text-charcoal ml-1 text-xs font-light">
                    <X className="h-3 w-3" />
                </button>
            </motion.div>
        );
    }

    return (
        <AnimatePresence>
            {!editing ? (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setEditing(true)}
                    className="text-bronze hover:text-charcoal mt-3 flex items-center gap-1.5 text-xs font-light transition-colors"
                >
                    <KeyRound className="h-3 w-3" strokeWidth={1.5} />
                    Add HuggingFace token to use this model
                </motion.button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-2"
                >
                    <div className="flex items-center gap-2">
                        <input
                            type="password"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSave()}
                            placeholder="hf_xxxxxxxxxxxxxxxx"
                            autoFocus
                            className="border-sand bg-base text-charcoal placeholder:text-stone/50 focus:border-bronze h-8 flex-1 rounded-lg border px-3 text-xs font-light focus:outline-none"
                        />
                        <button
                            onClick={handleSave}
                            disabled={!draft.trim()}
                            className="border-sand text-stone hover:border-bronze hover:text-bronze flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-30"
                        >
                            <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={() => {
                                setEditing(false);
                                setDraft("");
                            }}
                            className="border-sand text-stone hover:border-sand hover:text-charcoal flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
                        >
                            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                    </div>
                    <p className="text-stone text-[10px] leading-relaxed font-light">
                        Token stays in your browser only — never sent to any server except HuggingFace.{" "}
                        <a
                            href="https://huggingface.co/settings/tokens"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-bronze inline-flex items-center gap-0.5 hover:underline"
                        >
                            Get a token <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
