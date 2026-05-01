import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  MapPin,
  Calendar,
  Globe,
  PlusCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { appConfig } from "@/config/app.config";
import logoImg from "@/lib/assets/images/logo.png";

const navLinks = [
  { to: "/", label: "Local", icon: MapPin },
  { to: "/online", label: "Online", icon: Globe },
  { to: "/eventos", label: "Eventos", icon: Calendar },
  { to: "/cadastrar", label: "Cadastrar", icon: PlusCircle },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-none bg-pink-100/20 shadow-none backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="truncate text-xl leading-none font-bold text-primary sm:text-2xl">
              {appConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="gap-2"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <SheetDescription className="sr-only">
                Links principais para navegar pela Brechosfera.
              </SheetDescription>
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className="w-full justify-start gap-3"
                      >
                        <link.icon className="w-5 h-5" />
                        {link.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
