import { useState, type FormEvent } from 'react';
import { useApp } from '../context/AppContext';

export function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    const success = login(email, password);
    if (!success) {
      setError('يرجى إدخال البريد أو الجوال وكلمة المرور.');
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <h1>رجعة</h1>
          <p>خلّ لعميلك رجعة</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              البريد الإلكتروني أو رقم الجوال
            </label>
            <input
              id="email"
              type="text"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@magsala-demo.sa"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg">
            تسجيل الدخول
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          نسخة تجريبية — أي بيانات دخول تعمل
        </p>
      </div>
    </div>
  );
}
