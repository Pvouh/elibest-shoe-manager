
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Verify the user is in admin_credentials
        const { data: adminData } = await supabase
          .from("admin_credentials")
          .select("*")
          .eq("email", session.user.email)
          .eq("is_active", true)
          .single();

        if (adminData) {
          // User is authenticated and is an admin, redirect to dashboard
          navigate("/dashboard");
        } else {
          // User is authenticated but not an admin, sign them out and redirect to login
          await supabase.auth.signOut();
          navigate("/");
        }
      } else {
        // User is not authenticated, redirect to login page
        navigate("/");
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return null;
};

export default Index;
