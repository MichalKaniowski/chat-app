import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useIsScreenBig from "../hooks/context/useIsScreenBig";

import { getLastConversationIdForUser } from "../helpers/db/conversation/getLastConversationForUser";

import ConversationsList from "../components/conversations/sidebar/ConversationsList";
import Navigation from "../components/navigation/Navigation";
import Conversation from "../components/conversations/conversation/Conversation";
import { useQuery } from "react-query";
import getConversations from "../helpers/db/conversation/getConversations";

function RedirectToConversationPage() {
  const navigate = useNavigate();
  const { isScreenBig } = useIsScreenBig();

  useEffect(() => {
    const fn = async () => {
      const data = await getLastConversationIdForUser();
      const conversationId = data.conversationId;

      if (!conversationId) {
        navigate("/users");
        return;
      }

      navigate(`/conversations/${conversationId}`);
    };

    fn();
  }, [navigate]);

  // we are displaying loading ui of /conversations/:conversationId
  // to not have a flash after redirect from /conversations to /conversations/:conversationId
  return (
    <Navigation>
      {isScreenBig && <ConversationsList isLoading={true} />}

      <Conversation isLoading={true} />
    </Navigation>
  );
}

function FetchedConversationsList() {
  const { isLoading: conversationsIsLoading, data } = useQuery(
    ["conversations"],
    getConversations
  );

  return (
    <Navigation>
      <ConversationsList
        conversations={data?.conversations}
        isLoading={conversationsIsLoading}
      />
    </Navigation>
  );
}

export default function ConversationsPage() {
  const { isScreenBig } = useIsScreenBig();

  return isScreenBig ? (
    <RedirectToConversationPage />
  ) : (
    <FetchedConversationsList />
  );
}
