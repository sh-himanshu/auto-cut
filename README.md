<p align="center">
  <img src="brand/autocut-logo-dark.png" alt="Auto Cut Logo" width="80" />
</p>

<h1 align="center">Auto Cut</h1>

<p align="center">
  Remove image backgrounds directly in your browser — no data sent to any server.
</p>

<p align="center">
  <img src="brand/autocut-banner-light.png" alt="Auto Cut Banner" width="100%" />
</p>

## Features

- **3 AI Models** — Switch between IMG.LY (fast, on-device), RMBG-1.4 (high-quality transformer, ~40 MB), and RMBG-2.0 (best quality, gated model)
- **100% Client-Side** — All processing runs locally in your browser. Images never leave your device
- **Custom Backgrounds** — Replace backgrounds with transparent, solid colors, or any hex value
- **Multi-Format Export** — Download as PNG, JPEG, or WEBP at full resolution with no watermarks
- **Dark & Light Theme** — Smooth theme switching with system preference detection
- **Sample Images** — Try it instantly with built-in sample images
- **Offline-Ready PWA** — Works offline with service worker caching
- **HuggingFace Token Support** — Access gated models like RMBG-2.0 with your own token

## Tech Stack

- [Next.js](https://nextjs.org) (App Router, static export)
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Motion](https://motion.dev) (animations)
- [@imgly/background-removal](https://github.com/nicehash/background-removal-js)
- [@huggingface/transformers](https://huggingface.co/docs/transformers.js)

## Getting Started

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Start development server             |
| `pnpm build`     | Build for production (static export) |
| `pnpm start`     | Start production server              |
| `pnpm lint`      | Run ESLint                           |
| `pnpm typecheck` | Run TypeScript type checking         |
| `pnpm format`    | Format code with Prettier            |

## License

MIT

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
