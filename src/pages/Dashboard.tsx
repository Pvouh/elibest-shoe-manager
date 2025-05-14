
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import CategoryTabs from "@/components/inventory/CategoryTabs";
import InventoryTable from "@/components/inventory/InventoryTable";
import AddInventoryForm from "@/components/inventory/AddInventoryForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState("men");
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowAddForm(false);
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Shoe Inventory Management</h1>
            <p className="text-text/70">
              Manage your shoe inventory by category. Double-click on a cell to edit.
            </p>
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="bg-primary text-white flex items-center gap-2"
          >
            <Plus size={16} />
            {showAddForm ? "Hide Form" : "Add New Shoe"}
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <AddInventoryForm onSuccess={handleAddSuccess} />
        </div>
      )}

      <CategoryTabs
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <InventoryTable 
        category={activeCategory} 
        refreshTrigger={refreshTrigger} 
      />
    </Layout>
  );
};

export default Dashboard;
