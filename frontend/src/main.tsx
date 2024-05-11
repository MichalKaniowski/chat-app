import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/Root.tsx";

import UsersPage from "./pages/Users.tsx";
import ConversationsPage from "./pages/Conversations.tsx";
import Error from "./components/Error.tsx";
import App from "./App.tsx";
import { ModalContextProvider } from "./store/FileModalProvider.tsx";
import { QueryClientProvider, QueryClient } from "react-query";
import ConversationPage from "./pages/Conversation.tsx";
import { ScreenProvider } from "./store/ScreenProvider.tsx";
import { ConversationProvider } from "./store/ConversationProvider.tsx";

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
        element: <ConversationPage />,
        errorElement: <Error />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ScreenProvider>
        <ConversationProvider>
          <ModalContextProvider>
            <RouterProvider router={router}></RouterProvider>
          </ModalContextProvider>
        </ConversationProvider>
      </ScreenProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
