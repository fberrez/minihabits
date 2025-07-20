import { useAuth } from "./providers/AuthProvider";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { HabitList } from "./pages/HabitList";
import { StatsPage } from "./pages/StatsPage";
import { NewHabit } from "./pages/NewHabit";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import Account from "./pages/Account";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";

function App() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<HabitList />} />
        <Route path="/stats/:habitId" element={<StatsPage />} />
        <Route path="/new" element={<NewHabit />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-use" element={<TermsOfUse />} />
    </Routes>
  );
}

export default App;
