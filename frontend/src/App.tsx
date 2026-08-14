import { AppLayout } from './components/AppLayout';
import { useApp } from './context/AppContext';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterWashPage } from './pages/RegisterWashPage';
import { CustomerDetailsPage } from './pages/CustomerDetailsPage';
import { CustomersPage } from './pages/CustomersPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { InvoiceDetailsPage } from './pages/InvoiceDetailsPage';
import { LoyaltyPage } from './pages/LoyaltyPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

function AppPages() {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'dashboard':
      return <DashboardPage />;
    case 'register-wash':
      return <RegisterWashPage />;
    case 'customer-details':
      return <CustomerDetailsPage />;
    case 'customers':
      return <CustomersPage />;
    case 'invoices':
      return <InvoicesPage />;
    case 'invoice-details':
      return <InvoiceDetailsPage />;
    case 'loyalty':
      return <LoyaltyPage />;
    case 'reports':
      return <ReportsPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <DashboardPage />;
  }
}

export default function App() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AppLayout>
      <AppPages />
    </AppLayout>
  );
}
