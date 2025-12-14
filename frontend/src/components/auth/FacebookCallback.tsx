import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FacebookCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);

      fetch("http://localhost:8000/api/v1/auth/user", {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("user", JSON.stringify(data.data));
          navigate("/");
        });
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
