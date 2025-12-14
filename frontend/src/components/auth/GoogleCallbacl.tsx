import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      fetch("http://localhost:8000/api/v1/auth/user", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data));
          setTimeout(() => {
            navigate("/");
          }, 100);
        });
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
