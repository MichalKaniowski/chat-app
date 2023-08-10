import { createContext, useState } from "react";

export const AuthContext = createContext({
  token: "",
  onTokenChange: (token: string) => {},
});

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState("");

  function tokenChangeHandler(token: string) {
    setToken(token);
  }

  return (
    <AuthContext.Provider value={{ token, onTokenChange: tokenChangeHandler }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
