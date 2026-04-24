import type { ReactNode } from "react";

import type { ButtonTone } from "../_lib/types";

type ActionButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  tone?: ButtonTone;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function ActionButton({
  children,
  disabled = false,
  tone = "blue",
  type = "button",
  onClick
}: ActionButtonProps) {
  const toneClass =
    tone === "green"
      ? "bg-[linear-gradient(135deg,#29b36f_0%,#1f8f58_100%)] hover:brightness-105"
      : tone === "red"
        ? "bg-[linear-gradient(135deg,#e06269_0%,#c7424d_100%)] hover:brightness-105"
        : "bg-[linear-gradient(135deg,#163250_0%,#1a3d60_45%,#214a72_100%)] hover:bg-[linear-gradient(135deg,#1f6feb_0%,#21c7d9_100%)]";

  return (
    <button
      className={`rounded-[10px] border border-white/10 px-8 py-2 text-sm font-semibold tracking-[0.01em] text-white shadow-[0_12px_28px_rgba(15,33,57,0.16)] transition ${toneClass} disabled:cursor-not-allowed disabled:opacity-55`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
