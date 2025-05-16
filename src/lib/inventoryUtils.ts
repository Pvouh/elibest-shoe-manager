
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface InventoryItem {
  id: string;
  shoe_name: string;
  size: number;
  category: string;
  stock: number;
  buying_price: number;
  selling_price: number;
  profit: number;
  isEditing?: boolean;
  isModified?: boolean;
}

// Fetch inventory items by category
export const fetchInventoryByCategory = async (category: string): Promise<InventoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('category', category)
      .order('shoe_name');

    if (error) {
      toast.error(`Error fetching inventory: ${error.message}`);
      return [];
    }

    return data || [];
  } catch (error) {
    toast.error('Failed to fetch inventory data');
    return [];
  }
};

// Update an inventory item
export const updateInventoryItem = async (item: InventoryItem): Promise<boolean> => {
  try {
    // Create a clean object without isEditing and isModified flags
    const { isEditing, isModified, ...cleanItem } = item;
    
    // We no longer need to calculate profit here as it will be calculated by the database trigger
    
    const { error } = await supabase
      .from('inventory')
      .update(cleanItem)
      .eq('id', item.id);

    if (error) {
      toast.error(`Error updating item: ${error.message}`);
      return false;
    }

    return true;
  } catch (error) {
    toast.error('Failed to update inventory item');
    return false;
  }
};

// Validate inventory item
export const validateItem = (item: InventoryItem): string | null => {
  if (!item.shoe_name || item.shoe_name.trim() === "") {
    return "Shoe name is required";
  }
  
  if (!item.size) {
    return "Size is required";
  }
  
  if (!item.category || item.category.trim() === "") {
    return "Category is required";
  }
  
  if (item.stock < 0) {
    return "Stock quantity cannot be negative";
  }
  
  if (item.buying_price <= 0) {
    return "Buying price must be greater than 0";
  }
  
  if (item.selling_price <= item.buying_price) {
    return "Selling price must be greater than buying price";
  }
  
  return null;
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(amount);
};
