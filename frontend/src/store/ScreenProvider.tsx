import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface ScreenContextType {
  isScreenBig: boolean;
}

export const ScreenContext = createContext<ScreenContextType>({
  isScreenBig: false,
});

export function ScreenProvider({ children }: { children: React.ReactNode }) {
  const [isScreenBig, setIsScreenBig] = useState(false);

  useEffect(() => {
    function updateScreenSize() {
      setIsScreenBig(window.innerWidth >= 600);
    }

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  const value = useMemo(
    () => ({
      isScreenBig,
    }),
    [isScreenBig]
  );

  return (
    <ScreenContext.Provider value={value}>{children}</ScreenContext.Provider>
  );
}
