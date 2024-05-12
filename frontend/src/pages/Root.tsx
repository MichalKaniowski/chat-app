import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useOnPageExit from "../hooks/useOnPageExit";

export default function RootLayout() {
  const queryClient = new QueryClient();

  useOnPageExit();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Outlet />
    </QueryClientProvider>
  );
}
