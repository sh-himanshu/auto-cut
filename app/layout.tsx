import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistrar } from "./components/service-worker-registrar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const viewport: Viewport = {
    themeColor: "#bec9ff",
};

export const metadata: Metadata = {
    metadataBase: new URL("https://autocut.app"),
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
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="flex min-h-full flex-col">
                <ServiceWorkerRegistrar />
                {children}
            </body>
        </html>
    );
}
