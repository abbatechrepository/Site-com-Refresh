import { getBreadcrumbLabel, getBreadcrumbTop, getViewTitle, resolveUserPictureUrl } from "../_lib/utils";
import type { RefreshShellProps } from "../_lib/types";
import Image from "next/image";
import { refreshLogoSrc } from "../_lib/assets";

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

  const userPictureUrl = resolveUserPictureUrl(user?.picture);
  const userInitial = user?.name?.trim().slice(0, 1).toUpperCase() ?? "U";

  return (
    <main className="min-h-screen bg-[#edf3fb] text-[#16324f]">
      <div className="mx-auto flex min-h-screen max-w-[1920px] flex-col lg:grid lg:grid-cols-[292px_minmax(0,1fr)]">
        <aside className="border-r border-[#17345a] bg-[#0d1b2f] text-white lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <div className="px-6 py-6">
            <div className="flex items-center gap-3">
              <Image
                alt="Abbatech"
                className="h-12 w-auto rounded-[6px] bg-white/95 px-1.5 py-1"
                height={72}
                priority
                src={refreshLogoSrc}
                unoptimized
                width={100}
              />
              <div>
                <h1 className="text-[22px] font-extrabold uppercase leading-none">ABBATECH</h1>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fb3d7]">
                  Refresh
                </p>
              </div>
            </div>

            <nav className="mt-8 space-y-3">
              {topMenus.map((menu) => {
                const isCurrentMenu = topMenu === menu.key;
                const isOpen = expandedTopMenu === menu.key || isCurrentMenu;

                return (
                  <div className="rounded-[8px] border border-white/10 bg-white/[0.03] p-2" key={menu.key}>
                    <button
                      className={`flex w-full items-center justify-between rounded-[6px] px-3 py-2.5 text-left text-[13px] font-bold uppercase tracking-[0.08em] transition ${
                        isCurrentMenu
                          ? "bg-white text-[#10233d] shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                          : "text-[#d8e7f8] hover:bg-white/10 hover:text-white"
                      }`}
                      onClick={() => onToggleTopMenu(menu.key)}
                      type="button"
                    >
                      <span>{menu.label}</span>
                      <span className={isCurrentMenu ? "text-[#1f6feb]" : "text-[#21c7d9]"}>
                        {isOpen ? "-" : "+"}
                      </span>
                    </button>

                    {isOpen ? (
                      <div className="mt-2 space-y-1 border-l border-white/10 pl-2">
                        {(menuGroups[menu.key] ?? []).map((item) => (
                          <button
                            key={item.key}
                            className={`block w-full rounded-[6px] px-3 py-2 text-left text-[13px] transition ${
                              view === item.key
                                ? "bg-[#1f6feb] font-semibold text-white"
                                : "text-[#a9bfd7] hover:bg-white/8 hover:text-white"
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
                );
              })}
            </nav>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-[#d7e3f1] bg-[#f8fbff]/92 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6b8198]">
                  {getBreadcrumbTop(view)} / <span className="text-[#1f6feb]">{getBreadcrumbLabel(view)}</span>
                </p>
                <p className="mt-1 text-[15px] font-semibold text-[#10233d]">Painel administrativo</p>
              </div>

              <div className="relative">
                <button
                  className="flex min-w-[280px] items-center justify-between gap-4 rounded-[8px] border border-[#b9cde2] bg-white px-3 py-2 text-left shadow-[0_12px_28px_rgba(15,33,57,0.08)] transition hover:border-[#1f6feb]"
                  onClick={onToggleProfileMenu}
                  type="button"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-[#10233d] text-sm font-bold text-white">
                      {userPictureUrl ? (
                        <img
                          src={userPictureUrl}
                          alt={`Foto de ${user?.name ?? "usuário"}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{userInitial}</span>
                      )}
                    </span>
                    <span>
                      <span className="block text-[13px] font-bold text-[#10233d]">{user?.name ?? "Usuário"}</span>
                      <span className="block text-[11px] uppercase tracking-[0.12em] text-[#58708a]">{roleLabel}</span>
                    </span>
                  </span>
                  <span className="text-[18px] font-bold text-[#1f6feb]">{profileMenuOpen ? "-" : "+"}</span>
                </button>

                {profileMenuOpen ? (
                  <div className="absolute right-0 top-full z-40 mt-2 w-[340px] overflow-hidden rounded-[8px] border border-[#b9cde2] bg-white text-[#16324f] shadow-[0_24px_54px_rgba(15,33,57,0.2)]">
                    <div className="border-b border-[#d7e3f1] bg-[#10233d] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                      Perfis do usuário
                    </div>
                    {user?.roles.map((role) => (
                      <button
                        key={role.id}
                        className={`flex w-full items-start justify-between gap-3 border-b border-[#eef3f8] px-4 py-3 text-left text-[14px] transition hover:bg-[#f4f9ff] ${
                          selectedProfileId === role.id ? "bg-[#edf5ff]" : ""
                        }`}
                        onClick={() => onSwitchProfile(role.id)}
                        type="button"
                      >
                        <span>
                          <span className="block font-bold text-[#10233d]">{role.name}</span>
                          <span className="block text-[12px] text-[#58708a]">
                            {role.permissions.length} permissões neste perfil
                          </span>
                        </span>
                        <span className="rounded-[999px] bg-[#e8f2ff] px-2 py-1 text-[11px] font-bold text-[#1f6feb]">
                          {selectedProfileId === role.id ? "Ativo" : "Trocar"}
                        </span>
                      </button>
                    ))}
                    <button
                      className="w-full px-4 py-3 text-left text-[14px] font-bold text-[#c7424d] transition hover:bg-[#fff3f4]"
                      onClick={onLogout}
                      type="button"
                    >
                      Sair do sistema
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <div className="px-6 py-8 lg:px-8">
            <div className="mb-7 border-l-4 border-[#1f6feb] bg-white px-5 py-4 shadow-[0_14px_34px_rgba(15,33,57,0.08)]">
              <h1 className="font-display text-[32px] font-extrabold leading-tight text-[#10233d]">
                {getViewTitle(view)}
              </h1>
            </div>

            {error ? <p className="mb-4 rounded-[6px] border border-[#f1c9cf] bg-[#fff4f5] px-4 py-3 text-sm font-bold text-[#c0392b]">{error}</p> : null}
            {success ? <p className="mb-4 rounded-[6px] border border-[#cbe9d8] bg-[#f2fcf6] px-4 py-3 text-sm font-bold text-[#2d8d46]">{success}</p> : null}
            {isPending ? <p className="mb-4 rounded-[6px] border border-[#dbe8f5] bg-[#f6fbff] px-4 py-3 text-sm text-[#58708a]">Atualizando dados...</p> : null}

            <div>{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
