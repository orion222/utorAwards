import "./App.css";
import { UserProvider } from "./context/UserContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import ProtectedClearanceRoute from "./components/routes/ProtectedClearanceRoute";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedAuthRoute from "./components/routes/ProtectedAuthRoute";
import NotFound from "./pages/NotFound";
import ComponentLibrary from "./components/routes/ComponentLibrary";
import Wallet from "./components/user/wallet";

function App() {
  return (
    <BrowserRouter>
      <CookiesProvider>
        <UserProvider>
          <Routes>
            <Route index element={<ProtectedAuthRoute />} />
            <Route path="login" element={<Login />} />
            <Route path="components" element={<ComponentLibrary />}></Route>
            <Route element={<AppLayout />}>
              {/* ROUTES FOR REGULAR USERS */}
              <Route element={<ProtectedClearanceRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
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
        </UserProvider>
      </CookiesProvider>
    </BrowserRouter>
  );
}

export default App;
