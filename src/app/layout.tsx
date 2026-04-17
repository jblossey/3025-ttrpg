import type { Metadata } from "next";
import { Fira_Mono, Orbitron, Rajdhani } from "next/font/google";
import { headers } from "next/headers";

import { getAllCharacters } from "@/app/actions/character-actions";
import { CharacterNav } from "@/components/character-nav";
import { ImpersonationBanner } from "@/components/impersonation-banner";
import { auth } from "@/lib/auth";
import { isPrivilegedRole } from "@/lib/roles";

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
    ? "impersonatedBy" in session.session && !!session.session.impersonatedBy
    : false;

  const showCharacterNav = session && isPrivilegedRole(session.user.role);

  let characters: { id: string; name: string; ownerName: string }[] = [];
  if (showCharacterNav) {
    try {
      characters = await getAllCharacters();
    } catch {
      // User may not be authenticated on login page — silently ignore
    }
  }

  const needsTopPadding = isImpersonating || showCharacterNav;

  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable} ${firaMono.variable}`}
    >
      <body className="antialiased">
        {showCharacterNav && (
          <CharacterNav
            characters={characters}
            isImpersonating={isImpersonating}
          />
        )}
        {isImpersonating && session && (
          <ImpersonationBanner
            impersonatingAs={session.user.name ?? session.user.email}
          />
        )}
        {needsTopPadding ? (
          <div
            className={isImpersonating && showCharacterNav ? "pt-18" : "pt-10"}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
