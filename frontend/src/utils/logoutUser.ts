import updateOnlineStatus from "../helpers/db/updateOnlineStatus";
import deleteUser from "../helpers/db/user/deleteUser";
import getSession from "./getSession";

export async function logoutUser() {
  const { decodedToken, refreshToken } = getSession();
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");

  const userId = decodedToken?.id || "";
  await updateOnlineStatus(userId, false);

  await deleteUser(refreshToken);
}
