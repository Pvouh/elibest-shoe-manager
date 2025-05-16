
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  InventoryItem, 
  fetchInventoryByCategory, 
  updateInventoryItem,
  validateItem,
  formatCurrency
} from "@/lib/inventoryUtils";

interface InventoryTableProps {
  category: string;
  refreshTrigger?: number;
}

const InventoryTable = ({ category, refreshTrigger = 0 }: InventoryTableProps) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasModifications, setHasModifications] = useState(false);

  // Fetch inventory data when category changes or refresh is triggered
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchInventoryByCategory(category);
      setItems(data);
      setLoading(false);
    };

    fetchData();
  }, [category, refreshTrigger]);

  // Set up real-time subscription for changes
  useEffect(() => {
    const channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory',
          filter: `category=eq.${category}`
        },
        async () => {
          // Refetch data when changes occur
          const data = await fetchInventoryByCategory(category);
          // Only update if we're not in the middle of editing
          if (!hasModifications) {
            setItems(data);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [category, hasModifications]);

  const startEditing = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isEditing: true } : item
      )
    );
  };

  const handleChange = (id: string, field: string, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          let updatedItem = { ...item, [field]: value, isModified: true };
          
          // Recalculate profit if buying_price or selling_price changes
          if (field === "buying_price" || field === "selling_price") {
            const buyingPrice = field === "buying_price" ? Number(value) : item.buying_price;
            const sellingPrice = field === "selling_price" ? Number(value) : item.selling_price;
            updatedItem.profit = sellingPrice - buyingPrice;
          }
          
          return updatedItem;
        }
        return item;
      })
    );
    setHasModifications(true);
  };

  const saveRow = async (id: string) => {
    const itemToSave = items.find((item) => item.id === id);
    if (!itemToSave) return;

    const validationError = validateItem(itemToSave);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const success = await updateInventoryItem(itemToSave);
    
    if (success) {
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, isEditing: false, isModified: false } : item
        )
      );
      toast.success(`Changes saved for "${itemToSave.shoe_name}"`);
      
      // Check if any items are still modified
      const stillModified = items.some(item => item.id !== id && item.isModified);
      setHasModifications(stillModified);
    }
  };

  const saveAllChanges = async () => {
    const modifiedItems = items.filter((item) => item.isModified);
    
    // Validate all modified items
    const invalidItems = modifiedItems.map(item => {
      const error = validateItem(item);
      return error ? `${item.shoe_name}: ${error}` : null;
    }).filter(Boolean);
    
    if (invalidItems.length > 0) {
      toast.error(`Validation failed: ${invalidItems.join(', ')}`);
      return;
    }
    
    // Save all changes
    let successCount = 0;
    
    for (const item of modifiedItems) {
      const success = await updateInventoryItem(item);
      if (success) successCount++;
    }
    
    if (successCount > 0) {
      setItems(
        items.map((item) =>
          item.isModified ? { ...item, isEditing: false, isModified: false } : item
        )
      );
      
      toast.success(`${successCount} changes saved to database`);
      setHasModifications(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading inventory data...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-borderColor table-striped">
          <thead className="bg-gray">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Shoe Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Size
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Stock Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Buying Price (KES)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Selling Price (KES)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Profit
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-borderColor">
            {items.map((item) => (
              <tr key={item.id} className={item.isModified ? "bg-yellow-50" : ""}>
                <td
                  className="px-4 py-3 whitespace-nowrap table-cell-editable"
                  onDoubleClick={() => startEditing(item.id)}
                >
                  {item.isEditing ? (
                    <Input
                      value={item.shoe_name}
                      onChange={(e) =>
                        handleChange(item.id, "shoe_name", e.target.value)
                      }
                      className="h-8 w-full"
                    />
                  ) : (
                    item.shoe_name
                  )}
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap table-cell-editable"
                  onDoubleClick={() => startEditing(item.id)}
                >
                  {item.isEditing ? (
                    <Input
                      type="number"
                      value={item.size}
                      onChange={(e) =>
                        handleChange(item.id, "size", Number(e.target.value))
                      }
                      className="h-8 w-28"
                      min={1}
                    />
                  ) : (
                    item.size
                  )}
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap table-cell-editable"
                  onDoubleClick={() => startEditing(item.id)}
                >
                  {item.isEditing ? (
                    <Input
                      value={item.category}
                      onChange={(e) =>
                        handleChange(item.id, "category", e.target.value)
                      }
                      className="h-8 w-28"
                    />
                  ) : (
                    item.category
                  )}
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap table-cell-editable"
                  onDoubleClick={() => startEditing(item.id)}
                >
                  {item.isEditing ? (
                    <Input
                      type="number"
                      value={item.stock}
                      onChange={(e) =>
                        handleChange(item.id, "stock", Number(e.target.value))
                      }
                      min="0"
                      className="h-8 w-20"
                    />
                  ) : (
                    item.stock
                  )}
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap table-cell-editable"
                  onDoubleClick={() => startEditing(item.id)}
                >
                  {item.isEditing ? (
                    <Input
                      type="number"
                      value={item.buying_price}
                      onChange={(e) =>
                        handleChange(
                          item.id,
                          "buying_price",
                          Number(e.target.value)
                        )
                      }
                      min="0.01"
                      step="0.01"
                      className="h-8 w-24"
                    />
                  ) : (
                    formatCurrency(item.buying_price)
                  )}
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap table-cell-editable"
                  onDoubleClick={() => startEditing(item.id)}
                >
                  {item.isEditing ? (
                    <Input
                      type="number"
                      value={item.selling_price}
                      onChange={(e) =>
                        handleChange(
                          item.id,
                          "selling_price",
                          Number(e.target.value)
                        )
                      }
                      min={item.buying_price + 0.01}
                      step="0.01"
                      className="h-8 w-24"
                    />
                  ) : (
                    formatCurrency(item.selling_price)
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium">
                  {formatCurrency(item.profit)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  {item.isModified && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-primary text-white hover:bg-primary/90"
                      onClick={() => saveRow(item.id)}
                    >
                      Save
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {hasModifications && (
        <div className="px-4 py-3 bg-gray border-t border-borderColor">
          <div className="flex justify-end">
            <Button 
              onClick={saveAllChanges}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Save All Changes
            </Button>
          </div>
        </div>
      )}

      {items.length === 0 && !loading && (
        <div className="text-center py-8 text-text/60">
          No inventory items found in {category} category. Add some items to get started.
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
