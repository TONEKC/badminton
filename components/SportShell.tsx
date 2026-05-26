import Link from "next/link";
import { Dumbbell } from "lucide-react";

type SportShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function SportShell({
  eyebrow = "Badminton Tournament",
  title,
  description,
  actions,
  children,
}: SportShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07110d] text-[#f4fbf7]">
      <div className="pointer-events-none fixed inset-0 opacity-30">
        <div className="absolute inset-x-0 top-20 h-px bg-[#b7f53d]" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-[#b7f53d]" />
        <div className="absolute bottom-20 left-0 h-px w-full bg-[#2a6f4a]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/apply" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#b7f53d] text-[#07110d]">
              <Dumbbell size={22} />
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase text-[#b7f53d]">
                CourtPass
              </span>
              <span className="block text-xs text-white/60">
                Tournament Registration
              </span>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm">
            <Link
              className="rounded-lg border border-white/15 px-3 py-2 text-white/80 hover:border-[#b7f53d] hover:text-[#b7f53d]"
              href="/apply"
            >
              สมัครแข่ง
            </Link>
            <Link
              className="rounded-lg border border-white/15 px-3 py-2 text-white/80 hover:border-[#b7f53d] hover:text-[#b7f53d]"
              href="/login"
            >
              ผู้สมัคร
            </Link>
            <Link
              className="rounded-lg border border-white/15 px-3 py-2 text-white/80 hover:border-[#b7f53d] hover:text-[#b7f53d]"
              href="/admin/login"
            >
              Admin
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 gap-8 py-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="pt-2">
            <p className="text-sm font-semibold uppercase text-[#b7f53d]">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight text-white sm:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-5 max-w-lg text-base leading-7 text-white/70">
                {description}
              </p>
            ) : null}
            {actions ? <div className="mt-6">{actions}</div> : null}
          </div>

          <div>{children}</div>
        </section>
      </div>
    </main>
  );
}
