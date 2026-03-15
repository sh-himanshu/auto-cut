"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { ImageIcon, Loader2 } from "lucide-react";
import { SampleImages } from "./sample-images";
import { useHaptics } from "@/app/hooks/use-haptics";

interface DropzoneProps {
    onFileSelected: (file: File) => void;
    disabled?: boolean;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export function Dropzone({ onFileSelected, disabled }: DropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { success, error: hapticError, nudge } = useHaptics();

    const handleFile = useCallback(
        (file: File) => {
            setFileError(null);
            if (!ACCEPTED_TYPES.includes(file.type)) {
                setFileError("Unsupported format. Please use PNG, JPEG, or WEBP.");
                hapticError();
                return;
            }
            if (file.size > MAX_FILE_SIZE) {
                setFileError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 25 MB.`);
                hapticError();
                return;
            }
            if (file.size === 0) {
                setFileError("File is empty.");
                hapticError();
                return;
            }
            setIsUploading(true);
            success();
            onFileSelected(file);
        },
        [onFileSelected, hapticError, success],
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            nudge();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile, nudge],
    );

    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isDragging) nudge();
            setIsDragging(true);
        },
        [isDragging, nudge],
    );

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
        },
        [handleFile],
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            transition={{ duration: 0.3 }}
            className="flex w-full flex-col items-center"
        >
            <div
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-label="Upload an image for background removal"
                aria-disabled={disabled || undefined}
                onDrop={disabled ? undefined : handleDrop}
                onDragOver={disabled ? undefined : handleDragOver}
                onDragEnter={disabled ? undefined : handleDragOver}
                onDragLeave={disabled ? undefined : handleDragLeave}
                onClick={disabled ? undefined : () => inputRef.current?.click()}
                onKeyDown={
                    disabled
                        ? undefined
                        : (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  inputRef.current?.click();
                              }
                          }
                }
                className={`group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed px-6 py-20 transition-all duration-500 ${
                    disabled
                        ? "border-sand/50 bg-surface/50 cursor-not-allowed opacity-50"
                        : isDragging
                          ? "border-bronze bg-bronze/5 cursor-pointer"
                          : "border-sand/80 bg-surface/40 hover:border-bronze/60 hover:bg-bronze/5 cursor-pointer"
                }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    onChange={handleChange}
                    className="hidden"
                />

                {isUploading ? (
                    <div className="flex flex-col items-center justify-center py-4">
                        <Loader2 className="text-bronze mb-4 h-10 w-10 animate-spin" strokeWidth={1.25} />
                        <h3 className="text-charcoal mb-2 font-serif text-xl font-medium tracking-wide">
                            Preparing image&hellip;
                        </h3>
                        <p className="text-stone text-sm font-light">Starting background removal</p>
                    </div>
                ) : (
                    <>
                        <motion.div
                            className="text-stone group-hover:text-bronze mb-4 rounded-full p-4 transition-colors duration-500"
                            animate={isDragging ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <ImageIcon className="h-10 w-10" strokeWidth={1} />
                        </motion.div>

                        <h3 className="text-charcoal mb-2 font-serif text-xl font-medium tracking-wide">
                            Select an image to begin
                        </h3>
                        <p className="text-stone mb-8 text-sm font-light">Drag and drop, or click to browse</p>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-elegant bg-charcoal text-surface flex items-center gap-2 rounded-full px-8 py-3 font-light tracking-wide"
                        >
                            Upload Image
                        </motion.button>

                        <div className="text-stone mt-8 flex gap-6 text-sm font-light tracking-widest uppercase">
                            <span>PNG</span>
                            <span>&middot;</span>
                            <span>JPG</span>
                            <span>&middot;</span>
                            <span>WEBP</span>
                        </div>

                        {fileError && (
                            <p role="alert" className="mt-4 text-sm font-light text-red-500">
                                {fileError}
                            </p>
                        )}
                    </>
                )}
            </div>

            <SampleImages onFileSelected={handleFile} />
        </motion.div>
    );
}
