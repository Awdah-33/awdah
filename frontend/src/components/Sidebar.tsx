import { useApp } from '../context/AppContext';
import { navItems } from '../config/navigation';
import { roleLabels } from '../config/navigation';

export function Sidebar() {
  const { currentPage, navigate, sidebarOpen, closeSidebar, logout, user } = useApp();

  return (
    <>
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="القائمة الرئيسية">
        <div className="sidebar-brand">
          <h1>رجعة</h1>
          <p>خلّ لعميلك رجعة</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.page}
              type="button"
              className={`nav-item ${item.hero ? 'hero' : ''} ${currentPage === item.page ? 'active' : ''}`}
              onClick={() => navigate(item.page)}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <p>
              {user.name} — {roleLabels[user.role]}
            </p>
          )}
          <button type="button" className="nav-item" onClick={logout} style={{ marginTop: '0.5rem' }}>
            <span className="nav-icon" aria-hidden="true">
              ⎋
            </span>
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
}
