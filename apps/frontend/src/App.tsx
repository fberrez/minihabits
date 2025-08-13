import { useAuth } from './providers/AuthProvider';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HabitList } from './pages/HabitList';
import { StatsPage } from './pages/StatsPage';
import { NewHabit } from './pages/NewHabit';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import Account from './pages/Account';
import ResetPassword from './pages/ResetPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import UseCases from './pages/UseCases';
import Student from './pages/use-cases/Student';
import ProductivityEntrepreneur from './pages/use-cases/ProductivityEntrepreneur';
import Gym from './pages/use-cases/Gym';
import Parent from './pages/use-cases/Parent';
import Mindfulness from './pages/use-cases/Mindfulness';
import Pricing from './pages/Pricing';
import BillingReturn from './pages/BillingReturn';

function App() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/habits" element={<HabitList />} />
        <Route path="/stats/:habitId" element={<StatsPage />} />
        <Route path="/new" element={<NewHabit />} />
        <Route path="/account" element={<Account />} />
        <Route path="/use-cases" element={<UseCases />} />
        <Route path="/use-cases/student" element={<Student />} />
        <Route
          path="/use-cases/productivity-entrepreneur"
          element={<ProductivityEntrepreneur />}
        />
        <Route path="/use-cases/gym" element={<Gym />} />
        <Route path="/use-cases/parent" element={<Parent />} />
        <Route path="/use-cases/mindfulness" element={<Mindfulness />} />
        <Route path="/" element={<Navigate to="/habits" replace />} />
        <Route path="*" element={<Navigate to="/habits" replace />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/billing/return" element={<BillingReturn />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/billing/return" element={<BillingReturn />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/use-cases" element={<UseCases />} />
      <Route path="/use-cases/student" element={<Student />} />
      <Route
        path="/use-cases/productivity-entrepreneur"
        element={<ProductivityEntrepreneur />}
      />
      <Route path="/use-cases/gym" element={<Gym />} />
      <Route path="/use-cases/parent" element={<Parent />} />
      <Route path="/use-cases/mindfulness" element={<Mindfulness />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-use" element={<TermsOfUse />} />
    </Routes>
  );
}

export default App;
