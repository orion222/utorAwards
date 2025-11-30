import "./App.css";
import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

import ProtectedClearanceRoute from "./components/routes/ProtectedClearanceRoute";
import AppLayout from "./components/layout/AppLayout";
import ProtectedAuthRoute from "./components/routes/RootElement.jsx";
import ProtectedOrganizerRoute from "./components/routes/ProtectedOrganizerRoute.jsx";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Events = lazy(() => import("./pages/Explore/Events.jsx"));
const Promotions = lazy(() => import("./pages/Explore/Promotions.jsx"));
const Login = lazy(() => import("./pages/Login"));
const Wallet = lazy(() => import("./pages/Wallet"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const CreatePurchase = lazy(() => import("./pages/CreatePurchase"));
const PastTransactions = lazy(() => import("./pages/PastTransactions"));
const ProcessRedemption = lazy(() => import("./pages/ProcessRedemption"));
const CreateUser = lazy(() => import("./pages/CreateUser"));
const Explore = lazy(() => import("./pages/Explore"));
const MyEvents = lazy(() => import("./pages/MyEvents/index.jsx"));
const Invitations = lazy(() => import("./pages/MyEvents/Invitations.jsx"));
const QRCode = lazy(() => import("./pages/Wallet/QRCode.jsx"));
const RedeemPoints = lazy(() => import("./pages/Wallet/RedeemPoints.jsx"));
const Transfer = lazy(() => import("./pages/Wallet/TransferPoints.jsx"));
const EventEditForm = lazy(() => import("./pages/Events/EditEventForm.jsx"));
const Leaderboard = lazy(() => import("./pages/Leaderboard/index.jsx"));
const EventDetails = lazy(() => import("./pages/EventDetails/index.jsx"));
const PromotionDetails = lazy(
  () => import("./pages/PromotionDetails/index.jsx"),
);
const TransactionDetails = lazy(
  () => import("./pages/TransactionDetails/index.jsx"),
);
const Admin = lazy(() => import("./pages/Admin/index.jsx"));
const AllUsers = lazy(() => import("./pages/Admin/AllUsers.jsx"));
const AllTransactions = lazy(() => import("./pages/Admin/AllTransactions.jsx"));
import ManageEventUsers from "./pages/events/ManageEventUsers.jsx";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route index element={<ProtectedAuthRoute />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          <Route
            path="manage-event-users"
            element={<ManageEventUsers />}
          ></Route>
          <Route element={<AppLayout />}>
            {/* ROUTES FOR REGULAR USERS */}
            <Route element={<ProtectedClearanceRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="past-transactions" element={<PastTransactions />} />
              <Route
                path="past-transactions/:transactionId"
                element={<TransactionDetails />}
              />
              <Route path="events" element={<Events />} />
              <Route path="/events/:eventId" element={<EventDetails />} />
              <Route path="promotions" element={<Promotions />} />
              <Route
                path="promotions/:promotionId"
                element={<PromotionDetails />}
              />
              <Route path="wallet" element={<Wallet />}>
                <Route path="my-qr-code" element={<QRCode />} />
                <Route path="redeem" element={<RedeemPoints />} />
                <Route path="transfer" element={<Transfer />} />
              </Route>
              <Route path="explore" element={<Explore />}>
                <Route path="events" element={<Events />} />
                <Route path="promotions" element={<Promotions />} />
              </Route>
              <Route path="my-events" element={<MyEvents />}>
                <Route path="invitations" element={<Invitations />} />
                <Route
                  path="management"
                  element={<ProtectedOrganizerRoute />}
                />
              </Route>
              <Route path="leaderboard" element={<Leaderboard />} />
            </Route>

            {/* ROUTES FOR CASHIERS */}
            <Route
              element={
                <ProtectedClearanceRoute
                  requiredClearance={["cashier", "manager", "superuser"]}
                />
              }
            >
              <Route path="create-transaction" element={<CreatePurchase />} />
              <Route
                path="redeem-transaction"
                element={<ProcessRedemption />}
              />
              <Route path="create-user" element={<CreateUser />} />
            </Route>

            {/*ROUTES FOR ORGANIZERS*/}
            <Route
              element={
                <ProtectedClearanceRoute requiredClearance={["organizer"]} />
              }
            >
              <Route path="events/:eventId/edit" element={<EventEditForm />} />
            </Route>
            {/* ROUTES FOR MANAGERS */}
            <Route
              element={
                <ProtectedClearanceRoute
                  requiredClearance={["manager", "superuser"]}
                />
              }
            >
              <Route path="admin" element={<Admin />}>
                <Route path="users" element={<AllUsers />} />
                <Route path="transactions" element={<AllTransactions />} />
              </Route>
            </Route>

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

export default App;
