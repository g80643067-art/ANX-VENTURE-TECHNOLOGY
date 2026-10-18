import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ANX Venture Technology | Elite Website Development & Meta Ads',
  description:
    'ANX Venture Technology crafts high-performance digital experiences, responsive web architectures, and high-conversion Meta Ads engines.',
  keywords: ['Website Development', 'Meta Ads', 'Digital Advantage', 'Responsive Web', 'Growth Marketing'],
  themeColor: '#08090B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#08090B] text-white selection:bg-white/20 selection:text-white antialiased overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
