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
      ? "border-[#2fa36b] bg-[#2fa36b] hover:border-[#25885a] hover:bg-[#25885a] focus-visible:ring-[#2fa36b]/25"
      : tone === "red"
        ? "border-[#d14f57] bg-[#d14f57] hover:border-[#b83d46] hover:bg-[#b83d46] focus-visible:ring-[#d14f57]/25"
        : "border-[#16324f] bg-[#16324f] hover:border-[#1f6feb] hover:bg-[#1f6feb] focus-visible:ring-[#1f6feb]/25";

  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center rounded-[6px] border px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_10px_22px_rgba(15,33,57,0.12)] transition duration-200 focus-visible:outline-none focus-visible:ring-4 ${toneClass} disabled:cursor-not-allowed disabled:opacity-50`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
