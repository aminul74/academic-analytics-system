"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

function Toast({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.id, onRemove]);

  const styles = {
    success: "bg-emerald-50 border-emerald-300 text-emerald-800",
    error: "bg-red-50 border-red-300 text-red-800",
    info: "bg-sky-50 border-sky-300 text-sky-800",
    warning: "bg-amber-50 border-amber-300 text-amber-800",
  };

  return (
    <div
      className={`border rounded-lg p-4 mb-2 flex items-center justify-between ${styles[toast.type]}`}
    >
      <p>{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-4 font-bold hover:opacity-70"
      >
        x
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
