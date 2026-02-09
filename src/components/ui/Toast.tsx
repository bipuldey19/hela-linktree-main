"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";

interface ToastMessage {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  toast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const toast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      const id = Date.now();
      setMessages((prev) => [...prev, { id, message, type }]);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {messages.map((msg) => (
          <ToastItem key={msg.id} {...msg} onClose={() => removeToast(msg.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  message,
  type,
  onClose,
}: ToastMessage & { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg =
    type === "success"
      ? "bg-green-600"
      : type === "error"
        ? "bg-red-600"
        : "bg-blue-600";

  return (
    <div
      className={`${bg} text-white px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2 animate-[slideIn_0.2s_ease-out]`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        &times;
      </button>
    </div>
  );
}
