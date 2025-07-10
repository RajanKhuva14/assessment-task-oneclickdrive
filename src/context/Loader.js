"use client";

import { createContext, useContext, useState, useCallback } from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = useCallback((text = "") => {
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-[#00000070] bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="flex flex-col items-center">
            <img
              src="/assets/Loader.png"
              alt="Loading..."
              className="h-36 w-36 animate-spin"
              style={{ animationDuration: "1s" }}
            />
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
