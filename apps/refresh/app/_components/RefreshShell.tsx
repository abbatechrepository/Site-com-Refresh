import { getBreadcrumbLabel, getBreadcrumbTop, getViewTitle } from "../_lib/utils";
import type { RefreshShellProps } from "../_lib/types";
import Image from "next/image";

export function RefreshShell({
  user,
  roleLabel,
  profileMenuOpen,
  onToggleProfileMenu,
  selectedProfileId,
  onSwitchProfile,
  onLogout,
  topMenus,
  topMenu,
  expandedTopMenu,
  onToggleTopMenu,
  menuGroups,
  view,
  onSelectView,
  error,
  success,
  isPending,
  children
}: RefreshShellProps) {
  return (
    <main className="min-h-screen bg-transparent text-[#16324f]">
      <header className="border-b border-[rgba(183,205,227,0.86)] bg-white/84 shadow-[0_14px_36px_rgba(15,33,57,0.06)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1600px] items-start justify-between px-6 py-7">
          <div className="leading-none flex items-center gap-4">
                      <Image
                        alt="Abbatech"
                        height={72}
                        priority
                        src="/abbatech/refresh/brand/logov2.png"
                        unoptimized
                        width={100}
                      />
                      <h1 className="text-[50px] font-bold uppercase leading-none tracking-[0.02em] bg-[linear-gradient(135deg,#13203a_0%,#18365c_54%,#1f4b78_100%)] bg-clip-text text-transparent">
                        ABBATECH
                      </h1>
                    </div>

          <div className="relative flex min-w-[320px] items-center justify-between rounded-[22px] border border-[rgba(18,39,66,0.1)] bg-[linear-gradient(135deg,#0f223c_0%,#143256_60%,#1973ea_100%)] px-5 py-5 text-white shadow-[0_18px_40px_rgba(15,33,57,0.24)]">
            <div className="flex items-center gap-4">
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/20 bg-white/12 text-lg font-semibold backdrop-blur-sm">
                {user?.name.slice(0, 1) ?? "U"}
              </div>
              <div>
                <p className="text-[15px] font-semibold tracking-[0.02em]">{user?.name ?? "Usuário"}</p>
                <p className="text-[13px] uppercase tracking-[0.12em] text-[#dbe8ff]">{roleLabel}</p>
              </div>
            </div>

            <button className="text-[30px] font-light leading-none" onClick={onToggleProfileMenu} type="button">
              ≡
            </button>

            {profileMenuOpen ? (
              <div className="absolute right-0 top-full z-30 mt-3 min-w-[300px] overflow-hidden rounded-[18px] border border-[rgba(183,205,227,0.95)] bg-white text-[#16324f] shadow-[0_24px_44px_rgba(15,33,57,0.18)]">
                <div className="border-b border-[rgba(215,227,241,0.9)] bg-[linear-gradient(135deg,#f7fbff_0%,#eef6ff_100%)] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#5a7592]">
                  Perfis do usuário
                </div>
                {user?.roles.map((role) => (
                  <button
                    key={role.id}
                    className={`flex w-full items-start justify-between border-b border-[rgba(233,240,247,0.95)] px-4 py-3 text-left text-[14px] hover:bg-[#f4f9ff] ${
                      selectedProfileId === role.id ? "bg-[#edf5ff]" : ""
                    }`}
                    onClick={() => onSwitchProfile(role.id)}
                    type="button"
                  >
                    <span>
                      <span className="block font-semibold text-[#1b5fc8]">{role.name}</span>
                      <span className="block text-[12px] text-[#58708a]">
                        {role.permissions.length} permissões neste perfil
                      </span>
                    </span>
                    <span className="text-[12px] font-semibold text-[#1f6feb]">
                      {selectedProfileId === role.id ? "Ativo" : "Trocar"}
                    </span>
                  </button>
                ))}
                <button
                  className="w-full px-4 py-3 text-left text-[14px] font-semibold text-[#c7424d] hover:bg-[#fff3f4]"
                  onClick={onLogout}
                  type="button"
                >
                  Sair do sistema
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-[rgba(215,227,241,0.9)] bg-white/88">
          <div className="mx-auto flex max-w-[1600px] items-center px-6">
            {topMenus.map((menu) => (
              <div className="relative" key={menu.key}>
                <button
                  className={`border-r border-[rgba(215,227,241,0.9)] px-9 py-4 text-[15px] font-medium tracking-[0.03em] ${
                    topMenu === menu.key ? "bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)] text-[#10233d]" : "text-[#45617d]"
                  }`}
                  onClick={() => onToggleTopMenu(menu.key)}
                  type="button"
                >
                  {menu.label}
                </button>

                {expandedTopMenu === menu.key ? (
                  <div className="absolute left-0 top-full z-20 min-w-[240px] overflow-hidden rounded-[16px] border border-[rgba(183,205,227,0.95)] bg-white shadow-[0_20px_40px_rgba(15,33,57,0.18)]">
                    {(menuGroups[menu.key] ?? []).map((item) => (
                      <button
                        key={item.key}
                        className={`block w-full border-b border-[rgba(233,240,247,0.95)] px-4 py-3 text-left text-[14px] hover:bg-[#f4f9ff] ${
                          view === item.key ? "font-semibold text-[#1f6feb]" : "text-[#45617d]"
                        }`}
                        onClick={() => onSelectView(menu.key, item.key)}
                        type="button"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="flex items-start justify-between border-b border-[rgba(215,227,241,0.9)] pb-5">
          <h1 className="font-display text-[34px] font-bold uppercase tracking-[0.02em] text-[#10233d]">
            {getViewTitle(view)}
          </h1>
          <p className="pt-4 text-[13px] font-medium uppercase tracking-[0.1em] text-[#6b8198]">
            {getBreadcrumbTop(view)} &gt; <span className="text-[#1f6feb]">{getBreadcrumbLabel(view)}</span>
          </p>
        </div>

        {error ? <p className="mt-4 rounded-[14px] border border-[#f1c9cf] bg-[#fff4f5] px-4 py-3 text-sm font-semibold text-[#c0392b]">{error}</p> : null}
        {success ? <p className="mt-4 rounded-[14px] border border-[#cbe9d8] bg-[#f2fcf6] px-4 py-3 text-sm font-semibold text-[#2d8d46]">{success}</p> : null}
        {isPending ? <p className="mt-4 rounded-[14px] border border-[#dbe8f5] bg-[#f6fbff] px-4 py-3 text-sm text-[#58708a]">Atualizando dados...</p> : null}

        <div className="pt-8">{children}</div>
      </div>
    </main>
  );
}
