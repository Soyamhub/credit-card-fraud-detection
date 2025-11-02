import { Link, useLocation } from "react-router-dom";
import { Shield, LayoutDashboard, ClipboardList, FileText, CreditCard, Info } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Shield },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/request", label: "Request", icon: ClipboardList },
  { path: "/transactions", label: "Transactions", icon: FileText },
  { path: "/result", label: "Result", icon: CreditCard },
  { path: "/about", label: "About", icon: Info },
];

const Navigation = () => {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FraudGuard
            </span>
          </Link>

          <div className="flex gap-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = pathname === path;

              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
