
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import CategoryTabs from "@/components/inventory/CategoryTabs";
import InventoryTable from "@/components/inventory/InventoryTable";

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState("men");

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
