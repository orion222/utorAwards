import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { WalletProvider } from "./context/WalletContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <WalletProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </WalletProvider>
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>,
);
