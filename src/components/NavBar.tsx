"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const links = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/activity", label: "Activity" },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, profile, loading, signOut } = useAuth();
  const loggedIn = !!session;

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

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
          {loading ? null : loggedIn ? (
            <>
              <Link
                href="/log"
                className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-[#06210f] transition-opacity hover:opacity-90"
              >
                + Log
              </Link>
              {profile && (
                <Link href={`/profile/${profile.username}`} className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatar_url ?? `https://i.pravatar.cc/150?u=${profile.id}`}
                    alt={profile.display_name}
                    className="h-8 w-8 rounded-full border border-border object-cover"
                  />
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-[#06210f] transition-opacity hover:opacity-90"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
