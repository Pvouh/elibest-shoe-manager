
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";

const Trending = () => {
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
        <h1 className="text-2xl font-bold mb-2">Trending Products</h1>
        <p className="text-text/70">Discover which products are trending this season.</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-center text-text/60">Trending features coming soon.</p>
      </div>
    </Layout>
  );
};

export default Trending;
