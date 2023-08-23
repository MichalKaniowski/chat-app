import React, { useState } from "react";

const ConversationsContext = React.createContext({
  isConversationOpen: false,
  onConversationStateChange: (state: boolean) => {},
});

export default ConversationsContext;

export function ConversationsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isConversationOpen, setIsConversationOpen] = useState(false);

  function changeConversationStateHandler(state: boolean) {
    //waiting for component to render before updating state
    setTimeout(() => {
      setIsConversationOpen(state);
    }, 0);
  }
  return (
    <ConversationsContext.Provider
      value={{
        isConversationOpen,
        onConversationStateChange: changeConversationStateHandler,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}
