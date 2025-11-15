import './App.css';
import { UserProvider } from './context/UserContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import ProtectedRoute from './components/routes/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Login from './pages/Login';

function App() {

    return (
        <BrowserRouter>
            <CookiesProvider>
                <UserProvider>
                    <Routes>
                        <Route index element={ <Landing /> } />
                        <Route path="login" element={ <Login /> } />

                        <Route element={ <AppLayout /> }>
                            {/* ROUTES FOR REGULAR USERS */}
                            <Route path="regular" element={ <ProtectedRoute /> }>
                                <Route path="dashboard" element={ <Dashboard /> } />
                            </Route>

                            <Route path="cashier" element={ <ProtectedRoute requiredClearance={ ["cashier", "manager", "superuser"] } /> }>
                                <Route path="" element={ <div>test</div> } />
                            </Route>

                            {/* Need to check if user has any events
                            <Route path="organizer" element={ <ProtectedRoute /> }>

                            </Route> */}

                            <Route path="manager" element={ <ProtectedRoute requiredClearance={ ["manager", "superuser"] } /> }>

                            </Route>

                            <Route path="superuser" element={ <ProtectedRoute requiredClearance={ ["superuser"] } /> }>

                            </Route>
                        </Route>


                    </Routes>
                </UserProvider>
            </CookiesProvider>
        </BrowserRouter>
    );
}

export default App
