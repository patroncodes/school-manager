import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { UrqlProvider } from "@/lib/urql/provider";
import { ReactNode } from "react";
import Script from "next/script";
import { createServerClient } from "@/lib/serverUtils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "School Management Application",
  description:
    "Comprehensive platform designed to streamline administrative tasks, manage student records, track attendance, and facilitate communication between teachers, students, and parents",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { ssr } = await createServerClient();

  const urqlData = ssr.extractData();

  return (
    <>
      <ClerkProvider>
        <html lang="en">
          <body className={`${inter.className} antialiased`}>
            <UrqlProvider urqlState={urqlData}>
              {children}
              <Toaster />
            </UrqlProvider>
          </body>
        </html>
      </ClerkProvider>

      <Script
        id="urql-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(urqlData) }}
      />
    </>
  );
}
