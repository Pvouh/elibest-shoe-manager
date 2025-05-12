
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Header = () => {
  const [activeLink, setActiveLink] = useState("shoes");
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app: supabase.auth.signOut()
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <header className="bg-light border-b border-borderColor shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold mr-8">ELIBEST MS</h1>
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/dashboard"
              className={`text-sm font-medium ${
                activeLink === "shoes" ? "text-primary" : "text-text"
              } hover:text-primary`}
              onClick={() => setActiveLink("shoes")}
            >
              Shoes
            </Link>
            <Link
              to="/analytics"
              className={`text-sm font-medium ${
                activeLink === "analytics" ? "text-primary" : "text-text"
              } hover:text-primary`}
              onClick={() => setActiveLink("analytics")}
            >
              Analytics
            </Link>
            <Link
              to="/trending"
              className={`text-sm font-medium ${
                activeLink === "trending" ? "text-primary" : "text-text"
              } hover:text-primary`}
              onClick={() => setActiveLink("trending")}
            >
              Trending
            </Link>
          </nav>
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="font-medium">
                admin@elibest.com
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
