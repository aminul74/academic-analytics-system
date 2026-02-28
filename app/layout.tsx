"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ToastProvider, useToast } from "@/lib/toastContext";
import { ToastContainer } from "@/components/ui/Toast";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toasts, removeToast } = useToast();
  const isAuthPage = pathname === "/";

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/students", label: "Students" },
    { href: "/courses", label: "Courses" },
    { href: "/faculty", label: "Faculty" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userName");
    router.push("/");
  };

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <h1 className="mb-6 text-xl font-semibold">Academic Dashboard</h1>
        <nav className="flex flex-col gap-2 flex-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`cursor-pointer rounded px-3 py-2 ${
                  active ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold cursor-pointer"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">
        {children}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </main>
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <ToastProvider>
          <LayoutContent>{children}</LayoutContent>
        </ToastProvider>
      </body>
    </html>
  );
}
