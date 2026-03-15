"use client";

import { useCallback, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useHaptics } from "@/app/hooks/use-haptics";

interface SampleImagesProps {
    onFileSelected: (file: File) => void;
}

const SAMPLES = [
    {
        label: "Person",
        url: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=640",
        thumb: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
        label: "Animal",
        url: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=640",
        thumb: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
        label: "Product",
        url: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=640",
        thumb: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
        label: "Nature",
        url: "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=640",
        thumb: "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
];

export function SampleImages({ onFileSelected }: SampleImagesProps) {
    const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
    const [errorIdx, setErrorIdx] = useState<number | null>(null);
    const { nudge, error: hapticError } = useHaptics();

    const handleSampleClick = useCallback(
        async (idx: number) => {
            if (loadingIdx !== null) return;
            nudge();
            setLoadingIdx(idx);
            setErrorIdx(null);
            try {
                const res = await fetch(SAMPLES[idx].url);
                if (!res.ok) throw new Error("Fetch failed");
                const blob = await res.blob();
                const ext = blob.type.split("/")[1] || "jpg";
                const file = new File([blob], `sample-${SAMPLES[idx].label.toLowerCase()}.${ext}`, {
                    type: blob.type,
                });
                onFileSelected(file);
            } catch {
                hapticError();
                setErrorIdx(idx);
            } finally {
                setLoadingIdx(null);
            }
        },
        [loadingIdx, onFileSelected, nudge, hapticError],
    );

    return (
        <div className="mt-8 flex flex-col items-center gap-3">
            <span className="text-stone text-sm font-light tracking-widest uppercase">Or try a sample</span>
            <div className="flex gap-3">
                {SAMPLES.map((sample, idx) => (
                    <button
                        key={sample.label}
                        onClick={() => handleSampleClick(idx)}
                        disabled={loadingIdx !== null}
                        className="group relative flex flex-col items-center gap-1.5"
                    >
                        <div className="border-sand group-hover:border-bronze group-hover:shadow-elegant-sm relative h-14 w-14 overflow-hidden rounded-xl border transition-all duration-300">
                            {loadingIdx === idx ? (
                                <div className="bg-charcoal/5 flex h-full w-full items-center justify-center">
                                    <Loader2 className="text-bronze h-4 w-4 animate-spin" strokeWidth={1.5} />
                                </div>
                            ) : errorIdx === idx ? (
                                <div className="flex h-full w-full items-center justify-center bg-red-50 dark:bg-red-950/20">
                                    <AlertCircle className="h-4 w-4 text-red-400" strokeWidth={1.5} />
                                </div>
                            ) : (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={sample.thumb}
                                    alt={sample.label}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    loading="lazy"
                                />
                            )}
                        </div>
                        <span className="text-stone group-hover:text-charcoal text-[10px] font-light transition-colors">
                            {errorIdx === idx ? "Failed" : sample.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
