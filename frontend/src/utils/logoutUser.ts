import deleteUser from "../helpers/deleteUser";

export async function logoutUser() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  await deleteUser();
}
