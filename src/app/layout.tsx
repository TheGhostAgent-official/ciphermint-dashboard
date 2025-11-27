import "./globals.css";
import type { Metadata } from "next";
import NavSidebar from "@/components/NavSidebar";

export const metadata: Metadata = {
  title: "CipherMint Chain Dashboard",
  description:
    "Live wallet and chain status for the CipherMint blockchain and ecosystem tokens.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="cm-app">
          <NavSidebar />
          <div className="cm-main-panel">{children}</div>
        </div>
      </body>
    </html>
  );
}
