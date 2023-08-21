export default function getAuthorizationHeader() {
  const token = sessionStorage.getItem("token");
  const refreshToken = sessionStorage.getItem("refreshToken");
  return `Bearer ${token}, Basic ${refreshToken}`;
}
