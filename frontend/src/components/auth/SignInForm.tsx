import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/v1/auth/login", {
        username,
        password,
        remember_me: isChecked,
      });

      if (res.status === 200) {
        const token = res.data.token;
        const user = res.data.user;

        if (isChecked) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
        } else {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("user", JSON.stringify(user));

          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }

        if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          if (user.id_role === 1 || user.id_role === 2) {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        }
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message ||
          "Login gagal! Terjadi kesalahan pada server"
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    if (redirectUrl) {
      sessionStorage.setItem("redirectUrl", redirectUrl);
    }
  }, [redirectUrl]);

  return (
    <div className="flex flex-col flex-1 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4 sm:px-0">
        <div className="w-full">
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 text-center font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Halaman Login
            </h1>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Masukan username dan password anda untuk login!
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-lg">
              {errorMessage}
            </div>
          )}

          <div>
            {/* <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              <button
                onClick={() => {
                  if (redirectUrl) {
                    sessionStorage.setItem("redirectUrl", redirectUrl);
                  }
                  window.location.href =
                    "http://localhost:8000/auth/google/redirect";
                }}
                className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
              >
                <FaGoogle className="fill-current size-5" />
                Sign in with Google
              </button>
              <button
                onClick={() => {
                  if (redirectUrl) {
                    sessionStorage.setItem("redirectUrl", redirectUrl);
                  }
                  window.location.href =
                    "http://localhost:8000/auth/facebook/redirect";
                }}
                className="inline-flex items-center justify-center gap-1 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
              >
                <FaFacebook className="fill-current size-5" />
                Sign in with Facebook
              </button>
            </div> */}
            {/* <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div> */}

            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="Masukan username anda"
                    value={username}
                    onChange={(e: any) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukan password anda"
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Remember me
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    {loading ? "Loading..." : "Login"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Belum Memiliki Akun? {""}
                <Link
                  to="/register"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Registrasi Akun
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
