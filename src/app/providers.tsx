"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import store from "./store";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <Provider store={store}>
        {children}
      </Provider>
    </SessionProvider>
  );
}