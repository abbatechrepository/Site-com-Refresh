"use client";

import { useEffect, useId, type ReactNode } from "react";

type AdminModalSize = "md" | "lg" | "xl" | "full";

type AdminModalProps = {
  children: ReactNode;
  description?: string;
  error?: string;
  isOpen: boolean;
  onClose: () => void;
  size?: AdminModalSize;
  success?: string;
  title: string;
};

const sizeClasses: Record<AdminModalSize, string> = {
  md: "max-w-[640px]",
  lg: "max-w-[860px]",
  xl: "max-w-[1120px]",
  full: "max-w-[1440px]"
};

export function AdminModal({
  children,
  description,
  error,
  isOpen,
  onClose,
  size = "lg",
  success,
  title
}: AdminModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[#07182c]/68 px-4 py-6 backdrop-blur-sm sm:py-8"
      role="dialog"
    >
      <button
        aria-label="Fechar modal"
        className="fixed inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />

      <div
        className={`relative my-auto w-full ${sizeClasses[size]} overflow-hidden rounded-[8px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(7,24,44,0.34)]`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[rgba(215,227,241,0.95)] bg-[linear-gradient(135deg,#ffffff_0%,#eef6ff_100%)] px-5 py-4">
          <div>
            <h2 className="font-display text-[28px] font-bold uppercase tracking-[0.02em] text-[#10233d]" id={titleId}>
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-[13px] leading-5 text-[#58708a]" id={descriptionId}>
                {description}
              </p>
            ) : null}
          </div>

          <button
            aria-label="Fechar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[#cddced] bg-white text-[18px] font-semibold text-[#31516f] shadow-[0_8px_18px_rgba(15,33,57,0.08)] transition hover:border-[#9eb8d6] hover:bg-[#f5faff]"
            onClick={onClose}
            title="Fechar"
            type="button"
          >
            X
          </button>
        </div>

        <div className="max-h-[calc(100vh-170px)] overflow-y-auto bg-[#f8fbff] p-4 sm:p-5">
          {error ? (
            <p className="mb-4 rounded-[8px] border border-[#f1c9cf] bg-[#fff4f5] px-4 py-3 text-sm font-semibold text-[#c0392b]">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="mb-4 rounded-[8px] border border-[#cbe9d8] bg-[#f2fcf6] px-4 py-3 text-sm font-semibold text-[#2d8d46]">
              {success}
            </p>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
