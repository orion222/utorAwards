import { useState } from 'react';
import './App.css';
import { UserProvider } from './context/UserContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import { CookiesProvider } from 'react-cookie';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Dashboard from './pages/Dashboard';

function App() {

    return (
        <CookiesProvider>
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route index element={ <Landing /> } />
                        <Route path="login" element={ <Login /> } />

                        {/* ROUTES FOR REGULAR USERS */}
                        <Route path="regular" element={ <ProtectedRoute /> }>
                            <Route path="dashboard" element={ <Dashboard /> } />
                        </Route>

                        <Route path="cashier" element={ <ProtectedRoute /> }>

                        </Route>

                        {/* Need to check if user has any events
                        <Route path="organizer" element={ <ProtectedRoute /> }>

                        </Route> */}

                        <Route path="manager" element={ <ProtectedRoute /> }>

                        </Route>

                        <Route path="superuser" element={ <ProtectedRoute /> }>

                        </Route>
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </CookiesProvider>
    );
}

export default App
