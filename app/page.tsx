import { Header } from "./components/header";
import { AppContainer } from "./components/app-container";
import { Features } from "./components/features";
import { Footer } from "./components/footer";

export default function Home() {
    return (
        <>
            {/* SVG filter for grainy texture */}
            <svg className="hidden">
                <filter id="grainy">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
            </svg>

            {/* Animated mesh gradient background */}
            <div className="mesh-bg" />

            {/* Grainy Texture Overlay */}
            <div className="noise-bg" />

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
                        No servers, no tracking, purely elegant.
                    </p>
                </div>

                <AppContainer />

                <Features />
            </main>

            <Footer />
        </>
    );
}
