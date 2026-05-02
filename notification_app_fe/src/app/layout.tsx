import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Notifications",
  description: "Real-time updates regarding Placements, Events, and Results",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
