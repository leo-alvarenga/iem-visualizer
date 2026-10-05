import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import "./index.css";
import "./i18n";
import App from "./App.tsx";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (_, query) => {
      if (query.queryKey[0] === "measurement") {
        const name = (query.meta as Record<string, string> | undefined)?.deviceName ?? String(query.queryKey[1]);
        toast(`Failed to load "${name}": measurement unavailable`);
      }
    },
  }),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
);
