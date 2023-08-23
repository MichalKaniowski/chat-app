export interface Token {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  active: boolean;
  image: string;
  role: string;
  refreshToken: string;

  conversationIds: string[];
  seenMessageIds: string[];
  sentMessageIds: string[];
}

export interface Conversation {
  _id: string;
  name: string;
  lastMessageAt: Date;
  isGroup: boolean;
  image: string;
  userIds: string[] | User[];
  messageIds: string[] | Message[];
}

export interface Message {
  _id: string;
  body: string;
  isBodyAnImage: boolean;
  image: string;
  authorId: string | User;
  conversationId: string | Conversation;
  seenIds: string[];
}
