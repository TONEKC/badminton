type FieldProps = {
  label: string;
  hint?: string;
  children: React.ReactNode;
};

export function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white/85">{label}</span>
      <span className="mt-2 block">{children}</span>
      {hint ? <span className="mt-2 block text-xs text-white/50">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "h-12 w-full rounded-lg border border-white/15 bg-white/8 px-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-[#b7f53d] focus:ring-2 focus:ring-[#b7f53d]/25 disabled:cursor-not-allowed disabled:opacity-50";

export const fileClass =
  "block w-full rounded-lg border border-dashed border-white/20 bg-white/8 px-4 py-4 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-[#b7f53d] file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#07110d] hover:border-[#b7f53d]";

export const primaryButtonClass =
  "inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#b7f53d] px-5 text-sm font-black text-[#07110d] transition hover:bg-[#d5ff68] disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButtonClass =
  "inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-bold text-white transition hover:border-[#b7f53d] hover:text-[#b7f53d] disabled:cursor-not-allowed disabled:opacity-60";

export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "error" | "success";
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "error"
      ? "border-red-400/40 bg-red-500/10 text-red-100"
      : tone === "success"
        ? "border-[#b7f53d]/50 bg-[#b7f53d]/10 text-[#eaffbd]"
        : "border-white/15 bg-white/8 text-white/75";

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${toneClass}`}>
      {children}
    </div>
  );
}
