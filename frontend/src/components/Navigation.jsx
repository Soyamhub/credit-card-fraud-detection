// src/components/Navigation.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, LayoutDashboard, ClipboardList, FileText, CreditCard, Info, LogIn, LogOut } from "lucide-react";
import { getAccessToken, logout, getAccessToken as getToken } from "@/services/auth";

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
  const navigate = useNavigate();
  const token = getToken();

  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">FraudGuard</span>
          </Link>

          <div className="flex items-center gap-2">
            {token && navItems.map(({ path, label, icon: Icon }) => {
              const isActive = pathname === path;
              return (
                <Link key={path} to={path} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline font-medium">{label}</span>
                </Link>
              );
            })}

            {!token && (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                <LogIn className="h-4 w-4" />
                <span className="hidden md:inline font-medium">Login</span>
              </Link>
            )}

            {token && (
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all">
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline font-medium">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
