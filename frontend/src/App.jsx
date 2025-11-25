import "./App.css";
import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

import ProtectedClearanceRoute from "./components/routes/ProtectedClearanceRoute";
import AppLayout from "./components/layout/AppLayout";

const Dashboard = lazy(() => import("./pages/Dashboard"));
// import Dashboard from "./pages/Dashboard";
import Events from "./pages/Explore/Events.jsx";
import Promotions from "./pages/Explore/Promotions.jsx";
import Login from "./pages/Login";
import ProtectedAuthRoute from "./components/routes/RootElement.jsx";
import NotFound from "./pages/NotFound";
import ComponentLibrary from "./components/routes/ComponentLibrary";
import Wallet from "./pages/Wallet";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreatePurchase from "./pages/CreatePurchase";
import PastTransactions from "./pages/transactions/PastTransactions";
import ProcessRedemption from "./pages/ProcessRedemption";
import CreateUser from "./pages/CreateUser";
import Explore from "./pages/Explore";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route index element={<ProtectedAuthRoute />} />
          <Route path="login" element={<Login />} />
          <Route path="components" element={<ComponentLibrary />}></Route>
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          <Route element={<AppLayout />}>
            {/* ROUTES FOR REGULAR USERS */}
            <Route element={<ProtectedClearanceRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="past-transactions" element={<PastTransactions />} />
              <Route path="events" element={<Events />} />
              <Route path="promotions" element={<Promotions />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="explore" element={<Explore />}>
                <Route path="events" element={<Events />} />
                <Route path="promotions" element={<Promotions />} />
              </Route>
            </Route>

            {/* ROUTES FOR CASHIERS */}
            <Route
              element={
                <ProtectedClearanceRoute
                  requiredClearance={["cashier", "manager", "superuser"]}
                />
              }
            >
              <Route path="create" element={<CreatePurchase />} />
              <Route path="redeem" element={<ProcessRedemption />} />
              <Route path="createUser" element={<CreateUser />} />
            </Route>

            {/*ROUTES FOR ORGANIZERS*/}
            <Route
              element={
                <ProtectedClearanceRoute
                  requiredClearance={["organizer"]}
                />
              }
            >
              ss
            </Route>

            {/* ROUTES FOR MANAGERS */}
            <Route
              element={
                <ProtectedClearanceRoute
                  requiredClearance={["manager", "superuser"]}
                />
              }
            >

            </Route>

            {/* ROUTES FOR SUPERUSERS */}
            <Route
              element={
                <ProtectedClearanceRoute requiredClearance={["superuser"]} />
              }
            >

            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
