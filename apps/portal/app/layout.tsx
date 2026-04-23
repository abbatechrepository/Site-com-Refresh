import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portal | Abbatech",
  description: "Portal publico em Next.js conectado a API e ao CMS Refresh."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <footer className="border-t border-ink/10 bg-white/75 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-ember">Abbatech</p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/72">
                  Portal publico conectado ao Refresh, com seções, SEO e publicações alimentadas pela API.
                </p>
              </div>
              <div className="text-sm leading-7 text-ink/68">
                <p>Portal: `http://localhost:3100`</p>
                <p>Refresh: `http://localhost:3101`</p>
                <p>API: `http://localhost:3333/api/v1`</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
