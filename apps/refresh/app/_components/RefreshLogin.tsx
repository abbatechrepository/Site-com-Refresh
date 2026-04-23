import type { FormEvent } from "react";

import { LegacyButton } from "./LegacyButton";

type RefreshLoginProps = {
  identifier: string;
  password: string;
  error: string;
  success: string;
  onIdentifierChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export function RefreshLogin({
  identifier,
  password,
  error,
  success,
  onIdentifierChange,
  onPasswordChange,
  onSubmit
}: RefreshLoginProps) {
  return (
    <main className="min-h-screen bg-transparent">
      <div className="border-b border-[rgba(183,205,227,0.8)] bg-white/85 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1600px] items-center px-6 py-8">
          <div className="leading-none">
            <div className="font-display text-[70px] font-bold uppercase tracking-[-0.04em] text-[#1973ea]">ABBATECH</div>
          </div>
        </div>
      </div>

      <section className="border-b border-[rgba(18,39,66,0.3)] bg-[radial-gradient(circle_at_78%_28%,rgba(33,199,217,0.28),transparent_16%),radial-gradient(circle_at_15%_10%,rgba(31,111,235,0.24),transparent_24%),linear-gradient(135deg,#091427_0%,#0f223c_54%,#143256_100%)]">
        <div className="mx-auto flex max-w-[1600px] items-start justify-between gap-10 px-6 py-10 text-white">
          <div className="pl-6">
            <p className="font-display text-[54px] font-bold uppercase leading-none tracking-[0.02em]">REFRESH - 2026</p>
            <p className="mt-2 max-w-[420px] text-[34px] font-light leading-[1.06] text-[#d9e7ff]">
              Sistema de Gestão Web
            </p>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-white/6 px-8 py-6 pr-24 text-right shadow-[0_20px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm">
            <p className="text-[17px] uppercase tracking-[0.12em] text-[#b5caea]">Suporte ABBATECH</p>
            <p className="mt-1 text-[30px] font-bold">(51) 9 9114-1291</p>
            <p className="mt-8 text-[18px] text-[#d7e6fb]">www.abbatech.dev.br</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-6 px-6 py-14 lg:grid-cols-[0.95fr_0.85fr]">
        <form
          className="overflow-hidden rounded-[24px] border border-[rgba(183,205,227,0.82)] bg-white/92 shadow-[0_24px_50px_rgba(15,33,57,0.12)] backdrop-blur-sm"
          onSubmit={onSubmit}
        >
          <div className="border-b border-[rgba(215,227,241,0.9)] bg-[linear-gradient(135deg,#f7fbff_0%,#eef6ff_100%)] px-6 py-5 text-[18px] font-semibold text-[#132742]">
            Login de usuário
          </div>
          <div className="space-y-7 px-5 py-6">
            <label className="block">
              <span className="mb-2 block text-[14px] font-semibold uppercase tracking-[0.08em] text-[#4d6680]">Usuário</span>
              <input
                className="h-[46px] w-full rounded-[12px] border border-[#d7e3f1] bg-[linear-gradient(180deg,#ffffff_0%,#f4f9ff_100%)] px-4 text-[18px] text-[#16324f] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-[#1f6feb] focus:ring-4 focus:ring-[rgba(31,111,235,0.14)]"
                onChange={(event) => onIdentifierChange(event.target.value)}
                value={identifier}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[14px] font-semibold uppercase tracking-[0.08em] text-[#4d6680]">Senha</span>
              <input
                className="h-[46px] w-full rounded-[12px] border border-[#d7e3f1] bg-[linear-gradient(180deg,#ffffff_0%,#f4f9ff_100%)] px-4 text-[18px] text-[#16324f] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-[#1f6feb] focus:ring-4 focus:ring-[rgba(31,111,235,0.14)]"
                onChange={(event) => onPasswordChange(event.target.value)}
                type="password"
                value={password}
              />
            </label>
            <div className="flex items-center justify-between border-t border-[rgba(215,227,241,0.9)] pt-4">
              <button className="text-[13px] font-semibold text-[#1f6feb]" type="button">
                Lembrar senha
              </button>
              <LegacyButton tone="blue" type="submit">
                Entrar
              </LegacyButton>
            </div>
            {error ? <p className="text-sm font-semibold text-[#c0392b]">{error}</p> : null}
            {success ? <p className="text-sm font-semibold text-[#2d8d46]">{success}</p> : null}
          </div>
        </form>

        <section className="px-4 py-4">
          <h2 className="font-display text-[54px] font-bold uppercase tracking-[0.02em] text-[#10233d]">Precisa de Ajuda?</h2>
          <div className="mt-8 space-y-6 text-[17px] leading-8 text-[#58708a]">
            <p>
              No campo <strong>Usuário</strong> pode ser utilizado seu nome de usuário, e-mail ou CPF.
            </p>
            <p>
              <strong>Esqueceu a senha?</strong> Entre com o nome de usuário e clique em <strong>Lembrar senha</strong>.
              Você receberá por e-mail as instruções para recuperação da senha.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
