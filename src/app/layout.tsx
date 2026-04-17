import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ComparisonProvider } from "@/features/shop/context/comparison-context";
import { ComparisonBar } from "@/features/shop/components/comparison-bar";
import { ComparisonView } from "@/features/shop/components/comparison-view";
import { CartSidepad } from "@/features/cart/components/cart-sidepad";
import { Toaster } from "sonner";
import { LuxuryCursor } from "@/components/ui/luxury-cursor";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SCÊNTIA | Luxury Perfume & Fragrances",
    template: "%s | Scêntia Paris",
  },
  description: "Exquisite scents from the world's finest perfume houses. Experience the art of luxury fragrance with Scêntia, your premier destination for niche and luxury scents.",
  keywords: ["perfume", "fragrance", "luxury", "scent", "niche perfume", "luxury perfume store", "designer fragrances"],
  authors: [{ name: "Scêntia Artisans" }],
  creator: "Maison Scêntia",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: "SCÊNTIA | Luxury Perfume & Fragrances",
    description: "Experience the art of luxury fragrance. Discover our curated collection of world-class scents.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Maison Scêntia Luxury Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SCÊNTIA | Luxury Perfume & Fragrances",
    description: "The Art of Luxury Perfume.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} antialiased font-sans cursor-none`}>
        <QueryProvider>
          <ComparisonProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
            >
              <LuxuryCursor />
              <CartSidepad />
              <ComparisonBar />
              <ComparisonView />
              <Toaster position="top-center" richColors />
              {children}
            </ThemeProvider>
          </ComparisonProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
