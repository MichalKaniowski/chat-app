import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import UsersPage from "./pages/Users.tsx";
import ConversationsPage from "./pages/Conversations.tsx";
import Error from "./components/Error.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  { path: "/users", element: <UsersPage />, errorElement: <Error /> },
  {
    path: "/conversations",
    element: <ConversationsPage />,
    errorElement: <Error />,
  },
  {
    path: "/conversations/:conversationId",
    element: <ConversationsPage />,
    errorElement: <Error />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
