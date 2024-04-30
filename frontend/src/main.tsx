import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/Root.tsx";

import UsersPage from "./pages/Users.tsx";
import ConversationsPage from "./pages/Conversations.tsx";
import Error from "./components/Error.tsx";
import App from "./App.tsx";
import { ModalContextProvider } from "./store/FileModalProvider.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <App />, errorElement: <Error /> },
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ModalContextProvider>
      <RouterProvider router={router}></RouterProvider>
    </ModalContextProvider>
  </React.StrictMode>
);
