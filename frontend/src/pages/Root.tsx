import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConversationsContextProvider } from "../store/ConversationsProvider";

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ConversationsContextProvider>
        <Toaster />
        <Outlet />
      </ConversationsContextProvider>
    </QueryClientProvider>
  );
}
