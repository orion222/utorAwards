import "./App.css";
import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

import ProtectedClearanceRoute from "./components/routes/ProtectedClearanceRoute";
import AppLayout from "./components/layout/AppLayout";

const Dashboard = lazy(() => import("./pages/Dashboard"))
// import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedAuthRoute from "./components/routes/ProtectedAuthRoute";
import NotFound from "./pages/NotFound";
import ComponentLibrary from "./components/routes/ComponentLibrary";
import Wallet from "./components/user/wallet";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PastTransactions from "./pages/transactions/PastTransactions";


function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route index element={<ProtectedAuthRoute />} />
          <Route path="login" element={<Login />} />
          <Route path="components" element={<ComponentLibrary />}></Route>
          <Route path="forgot-password" element={ <ForgotPassword /> } />
          <Route path="reset-password" element={ <ResetPassword /> } />

          <Route element={<AppLayout />}>
            {/* ROUTES FOR REGULAR USERS */}
            <Route element={<ProtectedClearanceRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="past-transactions" element={<PastTransactions />} />
            </Route>

            {/* ROUTES FOR CASHIERS */}
            <Route
              element={
                <ProtectedClearanceRoute
                  requiredClearance={["cashier", "manager", "superuser"]}
                />
              }
            >
              <Route path="" element={<div>test</div>} />
            </Route>

            {/* temp route for wallet */}
            <Route path="wallet" element={<Wallet />}></Route>

            {/* Need to check if user has any events
                                                        <Route path="organizer" element={ <ProtectedRoute /> }>

                                                        </Route> */}

            {/* ROUTES FOR MANAGERS */}
            <Route
              element={
                <ProtectedClearanceRoute
                  requiredClearance={["manager", "superuser"]}
                />
              }
            ></Route>

            {/* ROUTES FOR SUPERUSERS */}
            <Route
              element={
                <ProtectedClearanceRoute requiredClearance={["superuser"]} />
              }
            ></Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App
