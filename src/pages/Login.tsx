
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Verify that the logged-in user is actually in our admin table
        const { data: adminData } = await supabase
          .from("admin_credentials")
          .select("*")
          .eq("email", session.user.email)
          .eq("is_active", true)
          .single();

        if (adminData) {
          navigate("/dashboard");
        } else {
          // If the user is not in our admin table, sign them out
          await supabase.auth.signOut();
        }
      }
    };
    
    checkSession();
  }, [navigate]);

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
