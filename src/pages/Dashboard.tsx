
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import CategoryTabs from "@/components/inventory/CategoryTabs";
import InventoryTable from "@/components/inventory/InventoryTable";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState("men");
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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Shoe Inventory Management</h1>
        <p className="text-text/70">
          Manage your shoe inventory by category. Double-click on a cell to edit.
        </p>
      </div>

      <CategoryTabs
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <InventoryTable category={activeCategory} />
    </Layout>
  );
};

export default Dashboard;
