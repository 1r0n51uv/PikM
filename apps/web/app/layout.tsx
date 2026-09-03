import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "PikM",
  description: "PKM, dieta, appunti e tracker palestra — dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
