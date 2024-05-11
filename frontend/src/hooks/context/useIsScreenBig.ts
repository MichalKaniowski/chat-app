import { useContext } from "react";
import { ScreenContext } from "../../store/ScreenProvider";

export default function useIsScreenBig() {
  return useContext(ScreenContext);
}
