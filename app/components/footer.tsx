import { Heart, Star } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-sand dark:border-stone/40 bg-surface/50 relative z-10 mt-auto w-full border-t backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 sm:flex-row sm:justify-between">
                <p className="text-stone dark:text-stone text-sm">
                    Auto Cut &mdash; 100% client-side background removal
                </p>

                <div className="flex items-center gap-6">
                    <a
                        href="https://github.com/sh-himanshu/auto-cut"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone hover:text-charcoal flex items-center gap-1.5 text-sm transition-colors duration-300 sm:hidden"
                    >
                        <Star className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Star on GitHub
                    </a>
                    <span className="text-stone flex items-center gap-1.5 text-sm">
                        Built with <Heart className="text-bronze h-3.5 w-3.5" strokeWidth={1.5} fill="currentColor" />
                    </span>
                </div>
            </div>
        </footer>
    );
}
