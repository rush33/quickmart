"use client";
import { useState } from "react";
import MapPickerContainer from "@/components/Map";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/supabase";

const Signup = () => {
  const router = useRouter();
  const { signup } = useAuth();
  const [image, setImage] = useState();
  const [step, setStep] = useState(1);
  const [coords, setCoords] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    shopName: "",
    address: "",
    genre: "",
  });

  const [errors, setErrors] = useState({});
  const [signupError, setSignupError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSignupError("");
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required!";
    if (!form.password) newErrors.password = "Password is required!";
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!form.shopName) newErrors.shopName = "Shop name is required!";
    if (!form.address) newErrors.address = "Address is required!";
    if (!form.genre) newErrors.genre = "Please specify at least one item!";
    if (!coords) newErrors.coords = "Please select your shop location!";
    if (!image) newErrors.image = "Please upload an image of your shop!";
    return newErrors;
  };

  const handleFirstSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateStep1();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = "";
    setLoading(true);

    if (image) {
      const filePath = `shop/${Date.now()}_${image.name}`;
      const { data, error } = await supabase.storage
        .from("shop")
        .upload(filePath, image);

      if (error) {
        console.error("Upload error:", error);
        return;
      }

      const { data: publicData } = supabase.storage
        .from("shop")
        .getPublicUrl(filePath);

      imageUrl = publicData?.publicUrl;
    }

    const validationErrors = validateStep2();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const genreArray = form.genre
      ? form.genre.split(",").map((item) => item.trim())
      : [];

    const response = await signup(
      form.email,
      form.password,
      form.shopName,
      form.address,
      imageUrl,
      genreArray,
      coords[0],
      coords[1]
    );

    if (response.success) {
      router.replace("/");
    } else {
      setSignupError(response.msg || "Failed to create account.");
    }
    setLoading(false);
  };

  return (
    <>
      <h2 className="text-3xl font-extrabold text-gray-600 mb-8 tracking-tight">
        {step === 1 ? "Create your account" : "Shop Details"}
      </h2>

      <form
        className="w-full flex flex-col gap-6"
        onSubmit={step === 1 ? handleFirstSubmit : handleFinalSubmit}
        noValidate
      >
        {step === 1 ? (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-gray-700"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-gray-700"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-blue-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-600 transition-all duration-200 mt-2"
            >
              Next
            </button>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Shop Name
              </label>
              <input
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-gray-700"
              />
              {errors.shopName && (
                <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Address
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-gray-700"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            <div className="relative">
              <label className="text-sm font-medium text-gray-600">
                Please upload an image of your shop
              </label>
              <label
                htmlFor="imageUpload"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
                  ${
                    image
                      ? "border-green-500 bg-green-100"
                      : "border-gray-300 bg-white hover:bg-gray-100"
                  }`}
              >
                {image ? (
                  <p className="text-green-700 font-medium">
                    Image Selected: {image.name}
                  </p>
                ) : (
                  <>
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                      Click to upload or drag & drop the photo
                    </p>
                  </>
                )}
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
              />
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                3 Things you sell (separeted by comma)
              </label>
              <input
                name="genre"
                value={form.genre}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-gray-700"
              />
              {errors.genre && (
                <p className="text-red-500 text-xs mt-1">{errors.genre}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Shop Location
              </label>
              <MapPickerContainer setCoords={setCoords} />
              {coords && (
                <p className="text-xs text-gray-500 mt-1">
                  Picked coordinates: {coords[0].toFixed(5)},{" "}
                  {coords[1].toFixed(5)}
                </p>
              )}
              {errors.coords && (
                <p className="text-red-500 text-xs mt-1">{errors.coords}</p>
              )}
            </div>

            {signupError && (
              <p className="text-red-500 text-sm text-center mt-2">
                {signupError}
              </p>
            )}

            <button
              type="submit"
              className="w-full cursor-pointer bg-green-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-green-600 transition-all duration-200"
            >
              {loading ? "Creating account..." : "Submit"}
            </button>

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium shadow hover:bg-gray-300 transition-all duration-200"
              >
                ← Back
              </button>
            )}
          </>
        )}
      </form>

      <p className="mt-6 text-sm text-gray-500">
        Already have an account?{" "}
        <span
          className="font-bold cursor-pointer"
          onClick={() => router.push("/auth/login")}
        >
          Sign in
        </span>
      </p>
    </>
  );
};

export default Signup;
