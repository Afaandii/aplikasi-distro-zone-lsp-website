export const getCurrentUser = () => {
  const user = localStorage.getItem("user") || sessionStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};

export const getUserRole = (): "admin" | "kasir" | null => {
  const user = getCurrentUser();
  if (!user) return null;

  // SESUAIKAN DENGAN DATA KAMU
  if (user.id_role === 1) return "admin";
  if (user.id_role === 2) return "kasir";

  return null;
};
