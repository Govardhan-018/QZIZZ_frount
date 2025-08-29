import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");      // << NEW
  const navigate = useNavigate();

  /*──────────────── use-effect ────────────────*/
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      const expiry = Date.now() + 60 * 60 * 1000;
      localStorage.setItem("token", token);
      localStorage.setItem("token_expiry", expiry);
      navigate("/home");
    }
  }, [navigate]);

  /*──────────────── helpers ────────────────*/
  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    try {
      const res = await fetch(import.meta.env.VITE_USERLOG_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail: email, pass: password }),
      });

      if (res.ok) {
        const data = await res.json();
        const expiry = Date.now() + 60 * 60 * 1000;
        localStorage.setItem("token", data.token);
        localStorage.setItem("token_expiry", expiry);
        navigate("/home");
      } else {
        setFormError("Invalid email or password.");   // << NO alert
        setEmail("");
        setPassword("");
      }
    } catch (_) {
      setFormError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    try {
      const res = await fetch(import.meta.env.VITE_USERSIGN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail: email, pass: password }),
      });

      if (res.ok) {
        const data = await res.json();
        const expiry = Date.now() + 60 * 60 * 1000;
        localStorage.setItem("token", data.token);
        localStorage.setItem("token_expiry", expiry);
        localStorage.setItem("mail", email);
        navigate("/home");
      } else {
        setFormError("Signup failed. Please try again."); // << NO alert
        setEmail("");
        setPassword("");
      }
    } catch (_) {
      setFormError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = (e) => {
    e.preventDefault();
    window.location.href = import.meta.env.VITE_USERGOOGLE_URL;
  };

  /*──────────────── UI ────────────────*/
  return (
    <div className="min-h-screen flex items-center justify-center">
      {loading ? (
        <div className="flex flex-1 items-center justify-center w-full">
          <div className="text-center">
            <p className="text-xl font-semibold text-[#00ADB5] mb-4">Loading …</p>
            <div className="w-8 h-8 border-4 border-[#00ADB5] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      ) : (
        <>
          <Navbar />

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-20 px-4 w-full">
            {/* ─────────── Login card ─────────── */}
            <div className="bg-white rounded-xl border-2 border-[#393E46] p-8 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-2 text-[#222831]">Let's go in</h3>
              <h1 className="text-3xl font-bold mb-6 text-[#00ADB5]">Welcome</h1>

              {/* error banner */}
              {formError && (
                <div className="w-full mb-4 rounded bg-red-50 border border-red-300 text-red-700 px-3 py-2 text-center">
                  {formError}
                </div>
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-[#393E46] p-3 mb-4 w-full rounded focus:outline-none focus:border-[#00ADB5] bg-[#F7F7F7] text-[#222831]"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-[#393E46] p-3 mb-4 w-full rounded focus:outline-none focus:border-[#00ADB5] bg-[#F7F7F7] text-[#222831]"
              />

              <button
                onClick={handleLogin}
                className="w-full p-3 rounded font-semibold mb-3 bg-[#00ADB5] text-[#EEEEEE] hover:bg-[#393E46] transition-colors"
              >
                Login
              </button>

              <button
                onClick={handleSignup}
                className="w-full p-3 rounded font-semibold mb-3 bg-[#393E46] text-[#EEEEEE] hover:bg-[#00ADB5] transition-colors"
              >
                Sign Up
              </button>

              <div className="my-3 text-center text-[#222831]">or</div>

              <button
                onClick={handleGoogle}
                className="w-full p-3 rounded font-semibold flex items-center justify-center gap-3 bg-[#222831] text-[#EEEEEE] hover:bg-[#00ADB5] transition-colors"
              >
                <img
                  src="https://www.vectorlogo.zone/logos/google/google-tile.svg"
                  className="w-8 h-8"
                  alt="Google logo"
                />
                Sign in with Google
              </button>
            </div>

            {/* ─────────── About card ─────────── */}
            <div className="bg-white rounded-xl border-2 border-[#393E46] p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-[#00ADB5]">About QZIZZ.learn</h2>
              <p className="text-[#222831] text-center mb-2">
                Welcome to <span className="font-semibold text-[#00ADB5]">QZIZZ.learn</span>!
                This site lets you <span className="font-semibold text-[#393E46]">create quizzes with AI</span> and play with friends.
              </p>
              <ul className="list-disc pl-5 text-[#393E46] text-left">
                <li>Create custom quizzes powered by AI.</li>
                <li>Invite friends or groups to join your quiz.</li>
                <li>Compete and learn in real-time.</li>
                <li>Track scores and improve your knowledge.</li>
              </ul>
              <p className="mt-4 text-[#222831] text-center">
                Get started by signing up or logging in!
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Login;
