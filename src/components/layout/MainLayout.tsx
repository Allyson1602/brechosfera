import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-primary/10 via-accent to-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
