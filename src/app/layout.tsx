import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YouFix: Tool Rush | Interactive Emergency Workshop Repair Game',
  description: 'Gamifying emergency workshop repairs. Test your reaction speed, precision diagnostics, and hazard avoidance in the YouFix gaming ecosystem.',
  keywords: ['YouFix', 'Tool Rush', 'Browser Game', 'Workshop Game', 'Arcade', 'Next.js', 'React', 'Tailwind CSS'],
  authors: [{ name: 'YouFix Engineering Team' }],
  openGraph: {
    title: 'YouFix: Tool Rush',
    description: 'High-octane arcade repair simulation for the YouFix capstone ecosystem.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#030712',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950 flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}
