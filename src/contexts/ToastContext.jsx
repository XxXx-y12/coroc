import React, { createContext, useContext, useState } from "react";
import { CheckCircle2, AlertCircle, Activity } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-enter glass-panel px-6 py-4 rounded-xl flex items-center gap-3 border-l-4 shadow-2xl ${
              toast.type === "success" ? "border-l-emerald-400" : 
              toast.type === "error" ? "border-l-rose-400" : "border-l-blue-400"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="text-emerald-400" size={20} />
            ) : toast.type === "error" ? (
              <AlertCircle className="text-rose-400" size={20} />
            ) : (
              <Activity className="text-blue-400" size={20} />
            )}
            <p className="text-sm font-medium text-white">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};