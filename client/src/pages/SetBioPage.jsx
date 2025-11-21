import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const SetBioPage = () => {
  const navigate = useNavigate();
  const { authUser, login, axios } = useContext(AuthContext);
  const [bio, setBio] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (authUser) navigate("/");
    const pending = sessionStorage.getItem("pendingSignup");
    if (!pending) {
      toast.error("No signup data. Restart process.");
      return navigate("/login");
    }
    try {
      const parsed = JSON.parse(pending);
      setFullName(parsed.fullName || "");
      setEmail(parsed.email || "");
      setPassword(parsed.password || "");
    } catch {
      navigate("/login");
    }
  }, [authUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bio) return toast.error("Bio required");
    const verificationToken = sessionStorage.getItem("verificationToken");
    try {
      setSubmitting(true);
      // Perform signup now (backend currently does not enforce token, but we send it for future compatibility)
      const { data } = await axios.post("/api/auth/signup", {
        fullName,
        email: email.toLowerCase(),
        password,
        bio,
        verificationToken,
      });
      if (!data.success) {
        toast.error(data.message || "Signup failed");
        return;
      }
      // Auto login (backend signup returns token already but using login keeps socket logic consistent)
      await login("login", { email, password });
      sessionStorage.removeItem("pendingSignup");
      sessionStorage.removeItem("verificationToken");
      toast.success("Profile completed");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur rounded-xl p-6 w-full max-w-md text-white flex flex-col gap-4"
      >
        <h1 className="text-2xl mb-2">Complete Profile</h1>
        <p className="text-sm opacity-80">Hi {fullName}, add a short bio.</p>
        <textarea
          rows={5}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell others about yourself"
          className="w-full p-3 rounded bg-black/30 border border-white/20"
        />
        <button
          disabled={submitting}
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-violet-600 py-3 rounded"
        >
          {submitting ? "Saving..." : "Finish Signup"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-2 py-3 rounded border border-white/30"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default SetBioPage;
