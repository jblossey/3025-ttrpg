import type { Metadata } from "next";
import { Orbitron, Rajdhani, Fira_Mono } from "next/font/google";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ImpersonationBanner } from "@/components/ui/impersonation-banner";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const rajdhani = Rajdhani({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const firaMono = Fira_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "3025 TTRPG",
  description: "Tabletop role-playing game set in 3025",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isImpersonating = session?.session
    ? "impersonatedBy" in session.session &&
      !!session.session.impersonatedBy
    : false;

  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${firaMono.variable} antialiased`}
      >
        {isImpersonating && (
          <ImpersonationBanner
            impersonatingAs={session!.user.name ?? session!.user.email}
          />
        )}
        {isImpersonating ? (
          <div className="pt-10">{children}</div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
