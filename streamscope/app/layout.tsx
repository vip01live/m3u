import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "StreamScope — IPTV Playlist Auditor", description: "Authorized IPTV playlist availability checker and M3U exporter." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="hy"><body>{children}</body></html>; }
