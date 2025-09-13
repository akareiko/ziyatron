export default function AuthPopup({ setShowAuth }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setShowAuth(false);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowAuth(false)}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setShowAuth(false)} className="absolute top-3 right-3">✕</button>
        <h2 className="text-lg font-semibold mb-4">Sign in</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="p-2 rounded border" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="p-2 rounded border" />
          <button type="submit" className="bg-black text-white py-2 rounded">Login</button>
        </form>
      </div>
    </div>
  );
}
