
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Analytics</h1>
        <p className="text-text/70">Track your sales performance and inventory metrics.</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-center text-text/60">Analytics features coming soon.</p>
      </div>
    </Layout>
  );
};

export default Analytics;
