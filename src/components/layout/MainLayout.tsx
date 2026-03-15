import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-accent to-background">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
