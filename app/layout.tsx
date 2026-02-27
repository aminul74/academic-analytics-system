"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/students", label: "Students" },
    { href: "/courses", label: "Courses" },
    { href: "/faculty", label: "Faculty" },
  ];

  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <aside className="w-64 bg-gray-800 text-white p-6">
          <h1 className="mb-6 text-xl font-semibold">Academic Dashboard</h1>
          <nav className="flex flex-col gap-2">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded px-3 py-2 ${
                    active ? "bg-blue-600" : "hover:bg-gray-700"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </body>
    </html>
  );
}
