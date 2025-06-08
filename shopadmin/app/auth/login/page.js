"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setLoginError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required!";
    if (!form.password) newErrors.password = "Password is required!";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const { success, msg } = await login(form.email, form.password);

    if (success) {
      router.push("/dashboard");
    } else {
      setLoginError(msg || "Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-3xl font-extrabold text-gray-600 mb-8 tracking-tight">
        Login to your shop account
      </h2>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-6"
        noValidate
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            name="email"
            value={form.email}
            type="email"
            className={`px-4 py-3 rounded-lg border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-gray-700`}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Password</label>
          <input
            name="password"
            value={form.password}
            type="password"
            placeholder="••••••••"
            className={`px-4 py-3 rounded-lg border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-gray-700`}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {loginError && (
          <p className="text-red-500 text-sm text-center mt-2">{loginError}</p>
        )}

        <button
          type="submit"
          className="w-full cursor-pointer bg-blue-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-600 transition-all duration-200 mt-2"
        >
          {loading ? "Logging in..." : "Submit"}
        </button>
      </form>
      <p className="mt-6 text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <span
          className="font-bold cursor-pointer text-blue-600"
          onClick={() => router.push("/auth/signup")}
        >
          Sign up
        </span>
      </p>
    </div>
  );
};

export default Login;
