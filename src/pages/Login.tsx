
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Verify that the logged-in user is actually in our admin table
        try {
          const { data: adminData, error } = await supabase
            .from("admin_credentials")
            .select("*")
            .eq("email", session.user.email)
            .eq("is_active", true)
            .single();

          if (adminData) {
            navigate("/dashboard");
          } else {
            // If the user is not in our admin table, sign them out
            console.log("User not authorized as admin, signing out");
            await supabase.auth.signOut();
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          // If there's an error checking admin status, sign out to be safe
          await supabase.auth.signOut();
        }
      }
      
      setIsLoading(false);
    };
    
    checkSession();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">ELIBEST MS</h1>
        <p className="text-text/70">Shoe Management System</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
