import { useState } from "react";
import { Link } from "react-router";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import axios from "axios";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/register",
        {
          nama: nama,
          username: username,
          no_telp: noTelp,
          password: password,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        try {
          const loginResponse = await axios.post(
            "http://localhost:8080/api/v1/auth/login",
            {
              username: username,
              password: password,
            }
          );

          if (loginResponse.data.token) {
            // 3. Simpan token dari response login
            const token = loginResponse.data.token;
            sessionStorage.setItem("token", token);

            // 4. Arahkan ke homepage
            window.location.href = "/";
          }
        } catch (loginError: any) {
          setErrorMessage(
            "Registrasi berhasil, tetapi gagal login otomatis. Silakan coba login secara manual. " +
              loginError.message
          );
        }
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Terjadi kesalahan saat registrasi."
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md text-center">
              Halaman Registrasi
            </h1>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Masukan username, email dan password anda untuk registrasi!
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {errorMessage && (
            <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-lg">
              {errorMessage}
            </div>
          )}

          <div>
            {/* <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              <button
                onClick={() =>
                  (window.location.href =
                    "http://localhost:8000/auth/google/redirect")
                }
                className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
              >
                <FaGoogle className="fill-current size-5" />
                Sign up with Google
              </button>
              <button
                onClick={() =>
                  (window.location.href =
                    "http://localhost:8000/auth/facebook/redirect")
                }
                className="inline-flex items-center justify-center gap-1 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-6 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
              >
                <FaFacebook className="fill-current size-5" />
                Sign up with Facebook
              </button>
            </div>

            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div> */}

            {/* FORM */}
            <form onSubmit={handleRegister}>
              <div className="space-y-5">
                {/* Nama */}
                <div>
                  <div className="sm:col-span-1">
                    <Label>
                      Nama<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Masukan Nama anda"
                      value={nama}
                      onChange={(e: any) => setNama(e.target.value)}
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <div className="sm:col-span-1">
                    <Label>
                      Username<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Masukan username anda"
                      value={username}
                      onChange={(e: any) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                {/* No telepon */}
                <div>
                  <Label>
                    No. Telepon<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Masukan no. telepon anda"
                    value={noTelp}
                    onChange={(e: any) => setNoTelp(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Masukan password anda"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <FaEye className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <FaEyeSlash className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <div>
                  <button
                    disabled={loading}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                  >
                    {loading ? "Loading..." : "Register"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Sudah memiliki akun?{" "}
                <Link
                  to="/login"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
