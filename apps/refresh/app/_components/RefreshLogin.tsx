import type { FormEvent } from "react";
import Image from "next/image";

import { ActionButton } from "./ActionButton";
import { refreshLoginBackgroundSrc, refreshLogoSrc } from "../_lib/assets";

type SessionAlert = {
  title: string;
  message: string;
} | null;

type RefreshLoginProps = {
  identifier: string;
  password: string;
  error: string;
  success: string;
  sessionAlert: SessionAlert;
  onIdentifierChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export function RefreshLogin({
  identifier,
  password,
  error,
  success,
  sessionAlert,
  onIdentifierChange,
  onPasswordChange,
  onSubmit
}: RefreshLoginProps) {
  return (
    <main className="min-h-screen bg-[#edf3fb] text-[#16324f]">
      <section className="grid min-h-screen lg:grid-cols-[minmax(360px,520px)_minmax(0,1fr)]">
        <div className="flex min-h-screen flex-col border-r border-[#d7e3f1] bg-white px-7 py-7 shadow-[18px_0_42px_rgba(15,33,57,0.08)]">
          <div className="flex items-center gap-3">
            <Image
              alt="Abbatech"
              className="h-14 w-auto"
              height={72}
              priority
              src={refreshLogoSrc}
              unoptimized
              width={100}
            />
            <div>
              <h1 className="text-[28px] font-extrabold uppercase leading-none text-[#10233d]">ABBATECH</h1>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#58708a]">Refresh</p>
            </div>
          </div>

          <form className="mt-14 flex-1" onSubmit={onSubmit}>
            <div className="max-w-[463px]">
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#1f6feb]">Acesso seguro</p>
              <h2 className="mt-3 text-[34px] font-extrabold leading-tight text-[#10233d]">Login de usuário</h2>

              <div className="mt-8 space-y-6">
                {sessionAlert ? (
                  <div
                    className="flex items-start gap-3 rounded-[8px] border border-[#f0c36d]/70 bg-[#fff8e8] px-4 py-3 text-[#4d3a13]"
                    role="alert"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#f0c36d]/25 text-[15px] font-bold text-[#b7791f]">
                      !
                    </div>
                    <div className="space-y-1">
                      <p className="text-[14px] font-bold text-[#3d2c0f]">{sessionAlert.title}</p>
                      <p className="text-[13px] font-medium leading-5 text-[#6d5421]">{sessionAlert.message}</p>
                    </div>
                  </div>
                ) : null}

                <label className="block">
                  <span className="admin-label">Usuário</span>
                  <input
                    className="admin-input h-[46px] text-[16px]"
                    onChange={(event) => onIdentifierChange(event.target.value)}
                    value={identifier}
                  />
                </label>
                <label className="block">
                  <span className="admin-label">Senha</span>
                  <input
                    className="admin-input h-[46px] text-[16px]"
                    onChange={(event) => onPasswordChange(event.target.value)}
                    type="password"
                    value={password}
                  />
                </label>

                <div className="flex items-center justify-between border-t border-[#d7e3f1] pt-5">
                  <button className="text-[13px] font-bold text-[#0f58d8] hover:underline" type="button">
                    Lembrar senha
                  </button>
                  <ActionButton tone="blue" type="submit">
                    Entrar
                  </ActionButton>
                </div>
                {error ? <p className="text-sm font-bold text-[#c0392b]">{error}</p> : null}
                {success ? <p className="text-sm font-bold text-[#2d8d46]">{success}</p> : null}
              </div>
            </div>
          </form>

          <div className="mt-8 border-t border-[#d7e3f1] pt-5 text-[13px] leading-6 text-[#58708a]">
            <p className="font-bold text-[#10233d]">Suporte ABBATECH</p>
            <p>(51) 9 9114-1291</p>
            <p>www.abbatech.dev.br</p>
          </div>
        </div>

        <aside className="relative flex min-h-[420px] flex-col justify-between overflow-hidden bg-[#0d1b2f] px-8 py-9 text-white lg:min-h-screen lg:px-12 lg:py-12">
          <Image
            alt=""
            className="object-cover opacity-100"
            fill
            priority
            src={refreshLoginBackgroundSrc}
            unoptimized
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,27,47,0.92)_0%,rgba(13,27,47,0.76)_46%,rgba(13,27,47,0.52)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,27,47,0.38)_0%,rgba(13,27,47,0.08)_46%,rgba(13,27,47,0.78)_100%)]" />

          <div className="relative z-[1]">
            <p className="inline-flex border-l-4 border-[#21c7d9] bg-[#07182c]/70 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.22em] text-[#62f0ff] shadow-[0_12px_28px_rgba(0,0,0,0.24)]">
              REFRESH - 2026
            </p>
            <h2 className="mt-6 max-w-[760px] text-[58px] font-extrabold leading-[0.98] text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]">
              Gestão de Sistemas Web
            </h2>
          </div>

          <div className="relative z-[1] grid gap-4 text-white xl:grid-cols-2">
            <div className="border-l-4 border-[#21c7d9] bg-[#07182c]/76 px-5 py-4 shadow-[0_18px_34px_rgba(0,0,0,0.24)] backdrop-blur-sm">
              <p className="text-[15px] font-extrabold text-white">Usuário</p>
              <p className="mt-2 text-[14px] font-medium leading-6 text-[#eaf4ff]">
                Pode ser utilizado nome de usuário, e-mail ou CPF.
              </p>
            </div>
            <div className="border-l-4 border-[#2fa36b] bg-[#07182c]/76 px-5 py-4 shadow-[0_18px_34px_rgba(0,0,0,0.24)] backdrop-blur-sm">
              <p className="text-[15px] font-extrabold text-white">Recuperação</p>
              <p className="mt-2 text-[14px] font-medium leading-6 text-[#eaf4ff]">
                Use lembrar senha para receber as instruções por e-mail.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
