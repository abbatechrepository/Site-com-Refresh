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
          <footer className="border-t border-[#d7e3f1] bg-white/80 text-[#58708a]">
            <div className="mx-auto flex max-w-[1600px] items-center justify-center px-6 py-5 text-[13px]">
              AbbaTech © {new Date().getFullYear()} - Soluções Web | Refresh - Gestão Inteligente de Conteúdo em Sistemas
            </div>
          </footer>
        </div>
        <BackToTopButton />
      </body>
    </html>
  );
}
