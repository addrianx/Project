// LoginScreen — User authentication login page

window.LoginScreen = function LoginScreen({ onLogin, users }) {
  const { useState } = React;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedUser = username.trim().toLowerCase();
    const foundUser = users.find(u => u.username.toLowerCase() === trimmedUser);

    if (!foundUser) { setError('Username tidak ditemukan.'); return; }
    if (foundUser.password !== password) { setError('Password yang Anda masukkan salah.'); return; }
    if (foundUser.active === false) {
      setError('⚠️ Akun Anda telah nonaktif. Hubungi Admin untuk mengaktifkan kembali.');
      return;
    }

    onLogin(foundUser, rememberMe);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md space-y-6">

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-3xl mx-auto shadow-xl shadow-blue-600/30">
            📱
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            CIPTA POS <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">ANDROID</span>
          </h1>
          <p className="text-xs text-slate-400">Sistem Kasir &amp; Inventory Toko Komputer</p>
        </div>

        {/* Login Card */}
        <div className="pos-card p-6 space-y-5 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Masuk ke Akun</h2>
            <p className="text-xs text-slate-400">Silakan masukkan username dan password Anda.</p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Username</label>
              <input
                type="text" required value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Masukkan username..."
                className="w-full px-3.5 py-2.5 rounded-2xl text-xs glass-input focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <input
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan password..."
                className="w-full px-3.5 py-2.5 rounded-2xl text-xs glass-input focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0 ${rememberMe ? 'bg-blue-600 border-blue-500 shadow shadow-blue-500/30' : 'bg-slate-800 border-slate-700 group-hover:border-slate-500'}`}
                onClick={() => setRememberMe(p => !p)}
              >
                {rememberMe && <span className="text-[10px] text-white font-bold leading-none">✓</span>}
              </div>
              <input type="checkbox" className="hidden" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
              <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                Ingat saya selama <span className="text-blue-400 font-semibold">14 hari</span>
              </span>
            </label>

            <button type="submit"
              className="w-full py-3 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2">
              <span>🔑</span><span>Masuk Aplikasi</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
