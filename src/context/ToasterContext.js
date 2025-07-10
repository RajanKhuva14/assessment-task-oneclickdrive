"use client";

import { createContext, useContext, useState, useCallback } from "react";

const ToasterContext = createContext();

export function ToasterProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  return (
    <ToasterContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((toast) => {
          let bgColor;
          switch (toast.type) {
            case "success":
              bgColor = "bg-green-700";
              break;
            case "error":
              bgColor = "bg-red-700";
              break;
            default:
              bgColor = "bg-yellow-700";
          }

          return (
            <div
              key={toast.id}
              className={`${bgColor} px-4 py-2 rounded shadow text-white font-bold`}
            >
              {toast.message}
            </div>
          );
        })}
      </div>
    </ToasterContext.Provider>
  );
}

export function useToaster() {
  return useContext(ToasterContext);
}
