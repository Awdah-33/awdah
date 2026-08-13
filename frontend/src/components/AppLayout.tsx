import type { ReactNode } from 'react';
import { useApp } from '../context/AppContext';
import { pageTitles, roleLabels } from '../config/navigation';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { currentPage, toggleSidebar, logout, user } = useApp();
  const page = pageTitles[currentPage];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="app-header">
          <div className="header-start">
            <button
              type="button"
              className="menu-toggle"
              onClick={toggleSidebar}
              aria-label="فتح القائمة"
            >
              ☰
            </button>
            <h1 className="header-title">{page.title}</h1>
          </div>
          <div className="header-user">
            {user && (
              <div className="header-user-info">
                <span className="header-user-name">{user.name}</span>
                <span className="header-user-role">
                  {roleLabels[user.role]} — {user.branchName}
                </span>
              </div>
            )}
            <button type="button" className="logout-btn" onClick={logout}>
              خروج
            </button>
          </div>
        </header>
        <main className="page-container">{children}</main>
      </div>
    </div>
  );
}
