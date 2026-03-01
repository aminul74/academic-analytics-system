"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ToastProvider, useToast } from "@/lib/toastContext";
import { ToastContainer } from "@/components/ui/Toast";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/students", label: "Students" },
  { href: "/courses", label: "Courses" },
  { href: "/faculty", label: "Faculty" },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 flex flex-col z-50 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:z-auto lg:shrink-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h1 className="text-xl font-semibold mb-6">Academic Dashboard</h1>

        <button
          onClick={onClose}
          className={`lg:hidden absolute -right-4 top-12 bg-gray-800 hover:bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center border-2 border-gray-700 hover:border-blue-400 transition-all duration-300 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <nav className="flex flex-col gap-2 flex-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`rounded px-3 py-2 ${
                pathname.startsWith(href) ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("userName");
            router.push("/");
          }}
          className="mt-auto px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
        >
          Logout
        </button>
      </aside>
    </>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toasts, removeToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/") return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 relative z-40">
        <header className="lg:hidden bg-gray-800 text-white px-4 py-3 flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white focus:outline-none"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="text-lg font-semibold">Academic Dashboard</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 bg-gray-100 overflow-x-hidden">
          {children}
          <ToastContainer toasts={toasts} onRemove={removeToast} />
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden">
        <ToastProvider>
          <LayoutContent>{children}</LayoutContent>
        </ToastProvider>
      </body>
    </html>
  );
}
