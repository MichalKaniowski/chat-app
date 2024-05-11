import { useContext } from "react";
import { ConversationContext } from "../../store/ConversationProvider";

export default function useConversationContext() {
  return useContext(ConversationContext);
}
