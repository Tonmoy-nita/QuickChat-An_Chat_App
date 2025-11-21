import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const VerifyOtpPage = () => {
  console.log("Welcome Verify Page");
  const navigate = useNavigate();
  const { authUser, sendOtp, verifyOtp } = useContext(AuthContext);
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  // fullName and password not needed on this page (used later in set-bio)
  // bio handled later on set-bio page

  useEffect(() => {
    if (authUser) navigate("/");
    const pending = sessionStorage.getItem("pendingSignup");
    if (!pending) {
      toast("No signup data found. Please start again.");
      return navigate("/login");
    }
    try {
      const parsed = JSON.parse(pending);
      setEmail(parsed.email || "");
      // keep basic info in sessionStorage only
      // bio intentionally ignored here
    } catch {
      navigate("/login");
    }
  }, [authUser, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return toast.error("Enter 6-digit OTP");
    try {
      setSubmitting(true);
      // 1) verify OTP -> get verificationToken
      const result = await verifyOtp(email, otp);
      if (!result.success) return toast.error(result.message || "Invalid OTP");
      const verificationToken = result.verificationToken;
      if (!verificationToken) return toast.error("Verification token missing");

      // store verification token and proceed to bio setup
      sessionStorage.setItem("verificationToken", verificationToken);
      toast.success("OTP verified. Complete your profile.");
      navigate("/set-bio");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleVerify}
        className="bg-white/10 backdrop-blur rounded-xl p-6 w-full max-w-md text-white"
      >
        <h1 className="text-2xl mb-4">Verify OTP</h1>
        <p className="text-sm opacity-80 mb-3">
          We sent a 6-digit code to {email}
        </p>
        <input
          name="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          required
          maxLength={6}
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="Enter 6-digit OTP"
          className="w-full p-3 rounded bg-black/30 border border-white/20 mb-4 tracking-widest text-center"
        />
        <button
          disabled={submitting}
          className="w-full bg-gradient-to-r from-purple-500 to-violet-600 py-3 rounded"
          type="submit"
        >
          {submitting ? "Verifying..." : "Verify OTP"}
        </button>
        <div className="flex flex-col gap-2 mt-3">
          <button
            type="button"
            disabled={resending}
            onClick={async () => {
              try {
                setResending(true);
                const result = await sendOtp(email);
                if (result.success) {
                  toast.success("New OTP sent");
                } else {
                  toast.error(result.message || "Failed to resend OTP");
                }
              } catch (err) {
                toast.error(err.message);
              } finally {
                setResending(false);
              }
            }}
            className="w-full py-3 rounded bg-purple-600/40 border border-purple-500 disabled:opacity-50"
          >
            {resending ? "Sending..." : "Send OTP Again"}
          </button>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("pendingSignup");
              sessionStorage.removeItem("verificationToken");
              navigate("/login");
            }}
            className="w-full py-3 rounded border border-white/30"
          >
            Back to Signup
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtpPage;
