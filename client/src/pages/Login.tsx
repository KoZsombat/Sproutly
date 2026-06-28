import { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import MainApp from './App';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { t } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [logged, setlogged] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginName, setLoginName] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPass, setRegisterPass] = useState('');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('error');

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
          localStorage.setItem('token', token);
          setlogged(true);
          window.history.replaceState({}, document.title, '/');
          return;
        }

        const userData = await localStorage.getItem('token');
        if (!userData) {
          setlogged(false);
          return;
        }
        const res = await fetch(`/auth/userInDb`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData}`,
          },
        });
        if (!res.ok) {
          localStorage.removeItem('token');
          setlogged(false);
          return;
        }
        const data = await res.json();
        if (data.exists) setlogged(true);
        else {
          localStorage.removeItem('token');
          setlogged(false);
        }
      } catch (e) {
        console.error('Failed to fetch user data', e);
        localStorage.removeItem('token');
        setlogged(false);
      }
    };
    checkLoginStatus();
  }, [apiUrl]);

  const handleLogin = async () => {
    if (loginName && loginPass) {
      const user = {
        name: loginName,
        password: loginPass,
      };
      try {
        const response = await fetch(`/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        const data = await response.json();
        if (data.response === 1) {
          localStorage.setItem('token', data.token);
          setlogged(true);
          setShowLogin(false);
          setAlertMsg(t('login.successLogin'));
          setAlertType('success');
        } else {
          setAlertMsg(t('login.errorInvalidCredentials'));
          setAlertType('error');
        }
      } catch {
        setAlertMsg(t('login.errorServer'));
        setAlertType('error');
      }
    } else {
      setAlertMsg(t('login.errorEnterCredentials'));
      setAlertType('error');
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = async () => {
    if (registerName && registerEmail && registerPass.length >= 8) {
      if (!validateEmail(registerEmail)) {
        setAlertMsg(t('login.errorEmailInvalid'));
        setAlertType('error');
        return;
      }
      const user = {
        name: registerName,
        email: registerEmail,
        password: registerPass,
      };
      const response = await fetch(`/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      let data = null;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
      } catch (err) {
        console.error('Invalid JSON from server:', err);
      }

      if (!data) {
        setAlertMsg(t('login.errorUnexpectedResponse'));
        setAlertType('error');
        return;
      }

      if (data.response === 0) {
        setAlertMsg(t('login.errorUserExists'));
        setAlertType('error');
        return;
      } else if (data.response === 1) {
        localStorage.setItem('token', data.token);
        setlogged(true);
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPass('');
        setAlertMsg(t('login.successRegister'));
        setAlertType('success');
      } else {
        setAlertMsg(t('login.errorRegisterFailed'));
        setAlertType('error');
        return;
      }
    } else {
      setAlertMsg(t('login.errorFillFields'));
      setAlertType('error');
    }
  };

  const handleLogout = async () => {
    try {
      await localStorage.removeItem('user');
      await localStorage.removeItem('token');
      setlogged(false);
      setShowLogin(true);
      setLoginName('');
      setLoginPass('');
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPass('');
      setAlertMsg(t('login.successLogout'));
      setAlertType('success');
      document.location.href = `/auth/logout`;
    } catch (e) {
      console.error('Failed to remove user data', e);
    }
  };

  return (
    <>
      {logged ? (
        <div className="w-full min-h-screen bg-paper flex justify-center">
          <div className="2xl:w-[65vw] w-full h-full">
            <MainApp onLogout={handleLogout} />
          </div>
        </div>
      ) : (
        <div className="relative flex w-full min-h-screen items-center justify-center bg-paper overflow-hidden px-4">
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-leaf-100 blur-3xl opacity-70" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-sun/50 blur-3xl opacity-70" />

          {alertMsg && (
            <Alert message={alertMsg} type={alertType} onClose={() => setAlertMsg(null)} />
          )}
          <div className="relative w-full max-w-md">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-leaf-500 shadow-card">
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.8 2c1 5 .9 9-1.5 12-1.7 2.2-4.5 5-7.3 6Z" />
                  <path d="M2 22 17 7" />
                </svg>
              </div>
              <h1 className="mt-4 text-4xl font-bold font-display text-ink">Sproutly</h1>
              <p className="mt-1 text-sm text-muted">{t('login.tagline')}</p>
            </div>

            <div className="w-full bg-white rounded-3xl shadow-float border border-line p-5 sm:p-6">
              <div className="flex justify-center gap-1.5 mb-5 rounded-full bg-cream p-1">
                <button
                  className={`flex-1 rounded-full px-4 py-2 font-semibold transition-all cursor-pointer text-sm ${showLogin ? 'bg-leaf-500 text-white shadow-soft' : 'text-ink-2 hover:text-ink'}`}
                  onClick={() => setShowLogin(true)}
                >
                  {t('login.loginTab')}
                </button>
                <button
                  className={`flex-1 rounded-full px-4 py-2 font-semibold transition-all cursor-pointer text-sm ${!showLogin ? 'bg-leaf-500 text-white shadow-soft' : 'text-ink-2 hover:text-ink'}`}
                  onClick={() => setShowLogin(false)}
                >
                  {t('login.registerTab')}
                </button>
              </div>

              {showLogin ? (
                <div className="space-y-3">
                  <input
                    className="field"
                    placeholder={t('login.username')}
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    autoCapitalize="none"
                  />
                  <input
                    className="field"
                    placeholder={t('login.password')}
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                  />
                  <button
                    className="btn-leaf w-full cursor-pointer active:scale-[.99]"
                    onClick={handleLogin}
                  >
                    {t('login.loginButton')}
                  </button>
                  <button
                    className="w-full rounded-full border border-line bg-white py-3 font-semibold text-ink-2 hover:bg-leaf-50 transition-colors cursor-pointer"
                    onClick={() => (window.location.href = `/auth/google`)}
                  >
                    {t('login.googleLogin')}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    className="field"
                    placeholder={t('login.username')}
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    autoCapitalize="none"
                  />
                  <input
                    className="field"
                    placeholder={t('login.email')}
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    autoCapitalize="none"
                  />
                  <input
                    className="field"
                    placeholder={t('login.password')}
                    type="password"
                    value={registerPass}
                    onChange={(e) => setRegisterPass(e.target.value)}
                  />
                  <button
                    className="btn-leaf w-full cursor-pointer active:scale-[.99]"
                    onClick={handleRegister}
                  >
                    {t('login.registerButton')}
                  </button>
                  <button
                    className="w-full rounded-full border border-line bg-white py-3 font-semibold text-ink-2 hover:bg-leaf-50 transition-colors cursor-pointer"
                    onClick={() => (window.location.href = `/auth/google`)}
                  >
                    {t('login.googleLogin')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
