import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistrar } from "./components/service-worker-registrar";
import { ThemeProvider } from "./components/theme-provider";

const BASE_PATH = process.env.NODE_ENV === "development" ? "" : "/auto-cut";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["300", "400", "500"],
    display: "swap",
});

const cormorant = Cormorant_Garamond({
    variable: "--font-cormorant",
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    style: ["normal", "italic"],
    display: "swap",
});

export const viewport: Viewport = {
    themeColor: "#bec9ff",
};

export const metadata: Metadata = {
    metadataBase: new URL("https://sh-himanshu.github.io/auto-cut"),
    title: {
        default: "Auto Cut — Free Background Remover | Private & Offline",
        template: "%s | Auto Cut",
    },
    description:
        "Remove image backgrounds instantly in your browser for free. No uploads, no servers, no tracking — 100% private and works offline. AI-powered background removal tool.",
    applicationName: "Auto Cut",
    keywords: [
        "background remover",
        "remove background",
        "remove background from image",
        "free background remover",
        "background remover online",
        "image background remover",
        "AI background removal",
        "transparent background",
        "remove bg",
        "cut out image",
        "image editing",
        "browser tool",
        "privacy",
        "offline",
        "no upload",
    ],
    authors: [{ name: "Auto Cut" }],
    creator: "Auto Cut",
    publisher: "Auto Cut",
    category: "Technology",
    alternates: {
        canonical: "/",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        title: "Auto Cut — Free Background Remover | Private & Offline",
        description:
            "Remove image backgrounds instantly in your browser for free. No uploads, no servers, no tracking — 100% private and works offline.",
        siteName: "Auto Cut",
        images: [
            {
                url: "/og.png",
                width: 1200,
                height: 630,
                alt: "Auto Cut — Free AI Background Remover that works offline in your browser",
                type: "image/png",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Auto Cut — Free Background Remover | Private & Offline",
        description:
            "Remove image backgrounds instantly in your browser for free. No uploads, no servers, no tracking — works offline.",
        images: [
            {
                url: "/og.png",
                alt: "Auto Cut — Free AI Background Remover",
            },
        ],
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Auto Cut",
    },
    formatDetection: {
        telephone: false,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
            suppressHydrationWarning
        >
            <head>
                <link rel="manifest" href={`${BASE_PATH}/manifest.json`} />
                <link rel="icon" href={`${BASE_PATH}/favicon.ico`} sizes="any" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})()`,
                    }}
                />
            </head>
            <body className="bg-base text-charcoal selection:bg-bronze selection:text-surface flex min-h-full flex-col font-sans transition-colors duration-500">
                <ThemeProvider>
                    <ServiceWorkerRegistrar />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
