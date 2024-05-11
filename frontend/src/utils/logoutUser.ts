import deleteUser from "../helpers/db/user/deleteUser";

export async function logoutUser() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  await deleteUser();
}
