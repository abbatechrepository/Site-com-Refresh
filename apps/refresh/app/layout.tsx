import type { Metadata } from "next";
import { BackToTopButton } from "./_components/BackToTopButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Refresh - Gestão de Sistemas Web",
  description: "Refresh é uma plataforma de gestão de sistemas web desenvolvida pela AbbaTech, especializada em soluções de inteligência na web. Nossa plataforma oferece uma interface intuitiva e recursos avançados para monitoramento, análise e otimização de sistemas web, garantindo desempenho e eficiência máximos para seus projetos online. O Verdadeiro foco é a gestão de conteúdo, permitindo que os usuários organizem, publiquem e monitorem seus conteúdos de forma eficaz. Com o Refresh, você tem o controle total sobre seus sistemas web, impulsionando a produtividade e o sucesso dos seus projetos online.",
  icons: {
    icon: "/abbatech/refresh/brand/icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <footer className="bg-[#292929] text-[#a8a8a8]">
            <div className="mx-auto flex max-w-[1600px] items-center justify-center px-6 py-6 text-[14px]">
              AbbaTech © 2026 - Inteligência na Web | Refresh - Gestão de Sistemas Web
            </div>
          </footer>
        </div>
        <BackToTopButton />
      </body>
    </html>
  );
}
