import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/theme.css";
import "./styles/utils.css";
import "./index.css";
import App from "./App.jsx";
import { CookiesProvider } from "react-cookie";
import { UserProvider } from "./context/UserContext.jsx";
import { WalletProvider } from "./context/WalletContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <WalletProvider>
            <App />
          </WalletProvider>
        </UserProvider>
      </QueryClientProvider>
    </CookiesProvider>
  </StrictMode>,
);
