import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Users from "./components/Users.tsx";
import Conversations from "./components/Conversations.tsx";
import Conversation from "./components/Conversation.tsx";
import Error from "./components/Error.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  { path: "/users", element: <Users />, errorElement: <Error /> },
  {
    path: "/conversations",
    element: <Conversations />,
    errorElement: <Error />,
  },
  {
    path: "/conversations/:conversationId",
    element: <Conversation />,
    errorElement: <Error />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
