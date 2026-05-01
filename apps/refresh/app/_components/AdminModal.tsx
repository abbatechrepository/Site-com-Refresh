"use client";

import { useEffect, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";

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
  lg: "max-w-[900px]",
  xl: "max-w-[1180px]",
  full: "max-w-[1480px]"
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
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyMargin = document.body.style.margin;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.margin = "0";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.margin = previousBodyMargin;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const portalTarget = typeof document === "undefined" ? null : document.body;

  if (!isOpen || !portalTarget) {
    return null;
  }

  return createPortal(
    <div
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-[1000] isolate flex h-[100vh] w-[100vw] items-center justify-center overflow-hidden bg-[#07182c]/72 p-4 sm:p-6"
      role="dialog"
    >
      <div className="absolute inset-0 z-0 backdrop-blur-lg backdrop-saturate-50" />
      <button
        aria-label="Fechar modal"
        className="absolute inset-0 z-[1] cursor-default"
        onClick={onClose}
        type="button"
      />

      <div
        className={`relative z-[2] flex max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] ${sizeClasses[size]} flex-col overflow-hidden rounded-[8px] border border-white/70 bg-white shadow-[0_32px_90px_rgba(7,24,44,0.34)] sm:max-h-[calc(100vh-48px)] sm:w-[calc(100vw-48px)]`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#d7e3f1] bg-[#10233d] px-6 py-5 text-white">
          <div>
            <h2 className="font-display text-[24px] font-extrabold leading-tight" id={titleId}>
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-[13px] leading-5 text-[#b8cce4]" id={descriptionId}>
                {description}
              </p>
            ) : null}
          </div>

          <button
            aria-label="Fechar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-white/20 bg-white/10 text-[15px] font-bold text-white transition hover:bg-white/20"
            onClick={onClose}
            title="Fechar"
            type="button"
          >
            X
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#edf3fb] p-4 sm:p-6">
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
    </div>,
    portalTarget
  );
}
