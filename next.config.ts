import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
    output: "export",
    basePath: isDev ? "" : "/auto-cut",
    images: {
        unoptimized: true,
    },
    headers: isDev
        ? async () => [
              {
                  source: "/(.*)",
                  headers: [
                      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
                      { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
                  ],
              },
          ]
        : undefined,
};

export default nextConfig;
