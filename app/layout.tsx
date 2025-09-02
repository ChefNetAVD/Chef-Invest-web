import type { Metadata } from "next";
import "./globals.css";
import "./styles/design-tokens.css";

export const metadata: Metadata = {
  title: "ChefInvest - Платформа инвестиций в FoodTech",
  description: "ChefNet — это пространство для тех, кто хочет не только следить за развитием лучших foodtech-проектов, но и получать стабильный доход, участвуя в их успехе.",
  keywords: "инвестиции, foodtech, гастрономия, стартапы, криптовалюта, USDT, блокчейн",
  authors: [{ name: "ChefInvest Team" }],
  creator: "ChefInvest",
  publisher: "ChefInvest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://chefinvest.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "ChefInvest - Платформа инвестиций в FoodTech",
    description: "Инвестируйте в будущее гастрономии с ChefInvest. Платформа для инвестиций в инновационные foodtech-проекты.",
    url: 'https://chefinvest.com',
    siteName: 'ChefInvest',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ChefInvest - Платформа инвестиций в FoodTech',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ChefInvest - Платформа инвестиций в FoodTech",
    description: "Инвестируйте в будущее гастрономии с ChefInvest",
    images: ['/og-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
