import React, { useState, useCallback, useMemo } from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

export default function Navigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isConversationOpen, setIsConversationOpen] = useState(false);

  const conversationStateChangeHandler = useCallback((stage: boolean) => {
    setIsConversationOpen(stage);
  }, []);

  let elements = useMemo(
    () =>
      (React.Children.toArray(children) as React.ReactElement<any>[]).map(
        (child) =>
          React.cloneElement(child, {
            onConversationStateChange: conversationStateChangeHandler,
          })
      ),
    []
  );

  return (
    <>
      <DesktopSidebar>{children}</DesktopSidebar>
      <MobileFooter isConversationOpen={isConversationOpen}>
        {elements};
      </MobileFooter>
    </>
  );
}
