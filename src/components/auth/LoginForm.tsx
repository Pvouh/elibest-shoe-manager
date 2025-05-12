
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { signInAsAdmin } from "@/lib/authUtils";

const LoginForm = () => {
  const [email, setEmail] = useState("admin@elibest.com");
  const [password, setPassword] = useState("elibest123");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Only allow admin@elibest.com to login
      if (email !== "admin@elibest.com") {
        toast.error("Only admin@elibest.com is authorized.");
        setIsLoading(false);
        return;
      }

      // Try to sign in with the hardcoded admin credentials
      const authData = await signInAsAdmin();
      
      if (authData?.user) {
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        // If signInAsAdmin doesn't return user data but also doesn't throw an error,
        // it means there was a problem with sign-in but the error was already handled
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login to Elibest MS</CardTitle>
        <CardDescription className="text-center">
          Admin access only
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="admin@elibest.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="elibest123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-text/60">
          Only authorized administrators can access this system
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
