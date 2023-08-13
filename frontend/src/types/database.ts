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
