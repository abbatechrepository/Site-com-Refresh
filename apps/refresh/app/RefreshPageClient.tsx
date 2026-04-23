"use client";

import { RefreshLogin } from "./_components/RefreshLogin";
import { RefreshModules } from "./_components/RefreshModules";
import { RefreshShell } from "./_components/RefreshShell";
import { roleName } from "./_lib/utils";
import { useRefreshManager } from "./_hooks/useRefreshManager";

export default function RefreshPageClient() {
  const manager = useRefreshManager();

  if (!manager.token || !manager.user) {
    return (
      <RefreshLogin
        error={manager.error}
        identifier={manager.identifier}
        onIdentifierChange={manager.setIdentifier}
        onPasswordChange={manager.setPassword}
        onSubmit={manager.handleLogin}
        password={manager.password}
        success={manager.success}
      />
    );
  }

  return (
    <RefreshShell
      error={manager.error}
      expandedTopMenu={manager.expandedTopMenu}
      isPending={manager.isPending}
      menuGroups={manager.activeMenuConfig.groups}
      onLogout={manager.handleLogout}
      onSelectView={(nextTopMenu, nextView) => {
        manager.setTopMenu(nextTopMenu);
        manager.setView(nextView);
        manager.setExpandedTopMenu(null);
      }}
      onSwitchProfile={(profileId) => {
        void manager.switchProfile(profileId);
      }}
      onToggleProfileMenu={() => manager.setProfileMenuOpen((current) => !current)}
      onToggleTopMenu={(menuKey) => {
        manager.setTopMenu(menuKey);
        manager.setExpandedTopMenu((current) => (current === menuKey ? null : menuKey));
      }}
      profileMenuOpen={manager.profileMenuOpen}
      roleLabel={roleName(manager.activeProfile)}
      selectedProfileId={manager.selectedProfileId}
      success={manager.success}
      topMenu={manager.topMenu}
      topMenus={manager.topMenus}
      user={manager.user}
      view={manager.view}
    >
      <RefreshModules manager={manager} />
    </RefreshShell>
  );
}
