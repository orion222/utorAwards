import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/theme.css";
import "./styles/utils.css";
import "./index.css";
import App from "./App.jsx";
import { CookiesProvider } from "react-cookie";
import { UserProvider } from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CookiesProvider>
      <UserProvider>
          <App />
      </UserProvider>
    </CookiesProvider>
  </StrictMode>,
);
