
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
        // User is authenticated, redirect to dashboard
        navigate("/dashboard");
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
