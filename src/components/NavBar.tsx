"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CURRENT_USER_ID, getUser } from "@/lib/mockData";

const links = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/activity", label: "Activity" },
];

export default function NavBar() {
  const pathname = usePathname();
  const me = getUser(CURRENT_USER_ID)!;

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
        <Link href="/" className="flex items-center gap-1 text-lg font-bold tracking-tight">
          <span className="text-accent">Set</span>
          <span>list</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-muted">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "text-foreground" : "hover:text-foreground transition-colors"}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/log"
            className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-[#06210f] transition-opacity hover:opacity-90"
          >
            + Log
          </Link>
          <Link href={`/profile/${me.username}`} className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={me.avatarURL}
              alt={me.displayName}
              className="h-8 w-8 rounded-full border border-border object-cover"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
