import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';

export function MainLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className={isHomePage ? "min-h-screen bg-gradient-to-b from-primary/10 via-accent to-background" : "min-h-screen bg-background"}>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
