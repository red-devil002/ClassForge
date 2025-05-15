
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, role, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleColor = () => {
    switch (role) {
      case "ADMIN":
        return "bg-admin";
      case "TEACHER":
        return "bg-teacher";
      case "STUDENT":
        return "bg-student";
      default:
        return "bg-primary";
    }
  };

  const getDashboardLink = () => {
    switch (role) {
      case "ADMIN":
        return "/admin";
      case "TEACHER":
        return "/teacher";
      case "STUDENT":
        return "/student";
      default:
        return "/";
    }
  };

  return (
    <header className="bg-background border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-bold">ClassGen</span>
              <span className={cn("ml-2 px-2 py-1 rounded-md text-xs font-medium text-white", getRoleColor())}>
                {role}
              </span>
            </a>
          </div>
          
          {/* Desktop menu */}
          <nav className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <a 
                  href={getDashboardLink()} 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Dashboard
                </a>
                <a 
                  href="/profile" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Profile
                </a>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <a 
                  href="/signin" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Sign In
                </a>
                <Button asChild>
                  <a href="/signup">Sign Up</a>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {user ? (
              <>
                <a 
                  href={getDashboardLink()} 
                  className="block text-sm font-medium transition-colors hover:text-primary"
                >
                  Dashboard
                </a>
                <a 
                  href="/profile" 
                  className="block text-sm font-medium transition-colors hover:text-primary"
                >
                  Profile
                </a>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="flex items-center gap-1 w-full justify-start px-0"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <a 
                  href="/signin" 
                  className="block text-sm font-medium transition-colors hover:text-primary"
                >
                  Sign In
                </a>
                <Button asChild className="w-full">
                  <a href="/signup">Sign Up</a>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}