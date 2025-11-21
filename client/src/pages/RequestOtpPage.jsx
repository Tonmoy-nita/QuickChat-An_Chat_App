import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const RequestOtpPage = () => {
  console.log("Welcome Request Page");

  const navigate = useNavigate();
  const { authUser, sendOtp } = useContext(AuthContext);
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState("");
  const [hasPending, setHasPending] = useState(false);

  useEffect(() => {
    if (authUser) navigate("/");
    const pending = sessionStorage.getItem("pendingSignup");
    if (pending) {
      try {
        const parsed = JSON.parse(pending);
        if (parsed?.email) {
          setEmail(parsed.email);
          setHasPending(true);
        }
      } catch {}
    }
  }, [authUser, navigate]);

  const requestOtp = async (e) => {
    e?.preventDefault();
    if (!email) return toast.error("Email is required");
    try {
      setSending(true);
      const result = await sendOtp(email);
      if (result.success) {
        toast.success("OTP sent to your email");
        navigate("/verify-otp");
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={requestOtp}
        className="bg-white/10 backdrop-blur rounded-xl p-6 w-full max-w-md text-white"
      >
        <h1 className="text-2xl mb-4">Request OTP</h1>
        {!hasPending && (
          <p className="text-sm opacity-80 mb-3">
            Enter the email you want to verify
          </p>
        )}
        {hasPending && (
          <p className="text-sm opacity-80 mb-3">
            OTP will be sent to the email you provided during signup
          </p>
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={hasPending}
          className="w-full p-3 rounded bg-black/30 border border-white/20 mb-4 disabled:opacity-50"
        />
        <button
          disabled={sending}
          className="w-full bg-gradient-to-r from-purple-500 to-violet-600 py-3 rounded"
          type="submit"
        >
          {sending ? "Sending..." : "Send OTP"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-3 py-3 rounded border border-white/30"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default RequestOtpPage;
