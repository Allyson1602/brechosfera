import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import OnlinePage from "./pages/OnlinePage";
import EventsPage from "./pages/EventsPage";
import CreateEventPage from "./pages/CreateEventPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AuthRegisterPage from "./pages/AuthRegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import { ApolloProvider } from "@apollo/client/react";
import { Analytics } from "@vercel/analytics/react";
import { apolloClient } from "./lib/graphql/client";
import { AuthProvider } from "./providers/AuthProvider";
import { ProtectedRoute } from "./routes/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <ApolloProvider client={apolloClient}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Analytics />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AuthProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/online" element={<OnlinePage />} />
                <Route path="/eventos" element={<EventsPage />} />
                <Route path="/eventos/criar" element={<CreateEventPage />} />
                <Route path="/cadastrar" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<AuthRegisterPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ApolloProvider>
);

export default App;

