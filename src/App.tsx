import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import OnlinePage from "./pages/OnlinePage";
import EventsPage from "./pages/EventsPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./lib/graphql/client";

const queryClient = new QueryClient();

const App = () => (
  <ApolloProvider client={apolloClient}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/online" element={<OnlinePage />} />
              <Route path="/eventos" element={<EventsPage />} />
              <Route path="/cadastrar" element={<RegisterPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ApolloProvider>
);

export default App;
