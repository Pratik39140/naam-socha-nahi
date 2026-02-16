import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HashRouter } from "react-router-dom";

import HistoryPage from "./history/HistoryPage";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";
import UploadPage from "./upload/UploadPage";
import QueuePage from "./queue/QueuePage";
import PaymentPage from "./payment/PaymentPage";
import ProfilePage from "./profile/ProfilePage";
import MainShell from "./components/MainShell";



const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loggedIn = !!localStorage.getItem("logged_in");
  const location = useLocation();

  if (!loggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

const RedirectIfAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loggedIn = !!localStorage.getItem("logged_in");

  if (loggedIn) {
    return <Navigate to="/main/upload" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Auth Pages */}
        <Route
          path="/login"
          element={
            <RedirectIfAuth>
              <LoginPage />
            </RedirectIfAuth>
          }
        />
        <Route path="/signup" element={<SignupPage />} />

        {/* Main Shell (protected) */}
        <Route
          path="/main"
          element={
            <RequireAuth>
              <MainShell />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="upload" replace />} />

          <Route path="upload" element={<UploadPage />} />
          <Route path="queue" element={<QueuePage />} />
          <Route path="payment/:jobId" element={<PaymentPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Default fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
