import { useEffect } from "react";
import getSession from "../utils/getSession";
import updateOnlineStatus from "../helpers/db/updateOnlineStatus";

export default function useOnPageExit() {
  useEffect(() => {
    const fn = (e: BeforeUnloadEvent) => {
      const { decodedToken } = getSession();
      e.preventDefault();
      e.returnValue = "";

      const userId = decodedToken?.id || "";

      updateOnlineStatus(userId, false);
    };

    window.addEventListener("beforeunload", fn);

    return () => {
      window.removeEventListener("beforeunload", fn);
    };
  }, []);
}
