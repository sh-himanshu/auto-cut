import { Header } from "./components/header";
import { AppContainer } from "./components/app-container";
import { ErrorBoundary } from "./components/error-boundary";
import { Features } from "./components/features";
import { Footer } from "./components/footer";

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Auto Cut",
    url: "https://sh-himanshu.github.io/auto-cut",
    description:
        "Remove image backgrounds instantly in your browser for free. No uploads, no servers, no tracking — 100% private and works offline.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser with WebGPU or WebAssembly support",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
    featureList: [
        "AI-powered background removal",
        "100% browser-based processing",
        "No data uploaded to servers",
        "Works offline",
        "Free to use",
    ],
};

export default function Home() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            {/* SVG filter for grainy texture */}
            <svg className="hidden" aria-hidden="true">
                <filter id="grainy">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
            </svg>

            {/* Animated mesh gradient background */}
            <div className="mesh-bg" aria-hidden="true" />

            {/* Grainy Texture Overlay */}
            <div className="noise-bg" aria-hidden="true" />

            <Header />

            <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-grow flex-col items-center px-6 pt-20 pb-24">
                {/* Hero */}
                <div className="mb-16 max-w-2xl text-center">
                    <h1 className="text-charcoal mb-6 font-serif text-5xl leading-tight font-medium tracking-tight drop-shadow-sm md:text-6xl">
                        Remove backgrounds, <br />
                        <span className="text-bronze italic">with absolute privacy.</span>
                    </h1>
                    <p className="text-stone text-lg leading-relaxed font-light tracking-wide">
                        High-quality image editing directly in your browser.
                        <br />
                        No servers, no tracking, just pure simplicity.
                    </p>
                </div>

                <ErrorBoundary>
                    <AppContainer />
                </ErrorBoundary>

                <Features />
            </main>

            <Footer />
        </>
    );
}
