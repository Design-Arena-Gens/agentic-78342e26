import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orthographic Projection Explorer",
  description:
    "Visualize the front and top views of points located in different quadrants relative to HP and VP.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
