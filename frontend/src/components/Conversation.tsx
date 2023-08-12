import { useLocation } from "react-router-dom";
export default function Conversation() {
  const { state } = useLocation();
  const {
    _id: id,
    name,
    isGroup,
    userIds,
    messegeIds,
    createdAt,
    updatedAt,
  } = state;

  return <div>Conversation</div>;
}
