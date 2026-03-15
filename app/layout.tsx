import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistrar } from "./components/service-worker-registrar";
import { ThemeProvider } from "./components/theme-provider";

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
        default: "Auto Cut — Background Remover",
        template: "%s | Auto Cut",
    },
    description: "Remove image backgrounds directly in your browser — no data sent to any server.",
    applicationName: "Auto Cut",
    keywords: ["background remover", "remove background", "image editing", "browser tool", "privacy", "offline"],
    authors: [{ name: "Auto Cut" }],
    creator: "Auto Cut",
    openGraph: {
        type: "website",
        title: "Auto Cut — Background Remover",
        description: "Remove image backgrounds directly in your browser — no data sent to any server.",
        siteName: "Auto Cut",
        images: [
            {
                url: "/og.png",
                width: 1200,
                height: 630,
                alt: "Auto Cut — Background Remover",
                type: "image/png",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Auto Cut — Background Remover",
        description: "Remove image backgrounds directly in your browser — no data sent to any server.",
        images: ["/og.png"],
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
                <link rel="manifest" href="/auto-cut/manifest.json" />
                <link rel="icon" href="/auto-cut/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/auto-cut/apple-touch-icon.png" />
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
