import type { Metadata, Viewport } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "./globals.css";
import "./atelier.css";
import "./living-muse.css";
import "./typography.css";
import "./light-study.css";
import "./flagship.css";
import "./art-of-light.css";
import "./signature-stage.css";
import "./scroll-film.css";
import "./card-reveals.css";
import "./floating-lookbook.css";
import { StoreProvider } from "@/components/store-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { siteUrl } from "@/lib/site";
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "AURELLE | Gold Vermeil Jewellery",
    template: "%s | AURELLE",
  },
  description:
    "Explore sculptural gold vermeil rings, necklaces, earrings and bracelets. Discover AURELLE, an interactive jewellery storefront and portfolio concept.",
  applicationName: "AURELLE",
  openGraph: {
    title: "AURELLE | Gold Vermeil Jewellery",
    description:
      "Sculptural rings, fine necklaces and signature hoops in 18k gold vermeil. Explore the AURELLE jewellery portfolio concept.",
    images: [
      {
        url: "/images/campaign.webp",
        width: 1122,
        height: 1402,
        alt: "AURELLE sculptural gold jewellery campaign",
      },
    ],
    type: "website",
  },
  robots: { index: true, follow: true },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#141210" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <StoreProvider>
          <Header />
          {children}
          <Footer />
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
