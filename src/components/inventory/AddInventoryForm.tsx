
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

const AddInventoryForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shoe_name: "",
    size: "",
    category: "",
    stock: 0,
    buying_price: 0,
    selling_price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "stock" || name === "buying_price" || name === "selling_price" 
        ? Number(value) 
        : value,
    });
  };

  const calculateProfit = () => {
    return formData.selling_price - formData.buying_price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.shoe_name) {
      toast.error("Shoe name is required");
      return;
    }

    if (!formData.size) {
      toast.error("Size range is required");
      return;
    }

    if (!formData.category) {
      toast.error("Category is required");
      return;
    }

    if (formData.stock < 0) {
      toast.error("Stock quantity cannot be negative");
      return;
    }

    if (formData.buying_price <= 0) {
      toast.error("Buying price must be greater than 0");
      return;
    }

    if (formData.selling_price <= formData.buying_price) {
      toast.error("Selling price must be greater than buying price");
      return;
    }

    setLoading(true);

    try {
      // Calculate profit before inserting
      const profit = calculateProfit();
      
      // Convert size to number if storing a single number
      // Or use a size range as is if it's a range (e.g., "20-45")
      const sizeValue = formData.size.includes("-") ? 
        parseFloat(formData.size.split("-")[0]) || null : 
        parseFloat(formData.size) || null;

      const { error } = await supabase.from("inventory").insert({
        shoe_name: formData.shoe_name,
        size: sizeValue,
        category: formData.category,
        stock: formData.stock,
        buying_price: formData.buying_price,
        selling_price: formData.selling_price,
        profit: profit,
      });

      if (error) {
        throw error;
      }

      toast.success("Shoe added to inventory successfully!");
      // Reset form
      setFormData({
        shoe_name: "",
        size: "",
        category: "",
        stock: 0,
        buying_price: 0,
        selling_price: 0,
      });
      
      // Call the success callback to refresh the table
      onSuccess();
    } catch (error: any) {
      toast.error(`Error adding shoe: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Add New Shoe</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="shoe_name">Shoe Name</Label>
          <Input
            id="shoe_name"
            name="shoe_name"
            value={formData.shoe_name}
            onChange={handleChange}
            placeholder="Nike Air Max"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="men, women, kids, or slippers"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Size Range</Label>
          <Input
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            placeholder="20-45"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            min={0}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="buying_price">Buying Price (KES)</Label>
          <Input
            id="buying_price"
            name="buying_price"
            type="number"
            value={formData.buying_price}
            onChange={handleChange}
            min={0.01}
            step={0.01}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="selling_price">Selling Price (KES)</Label>
          <Input
            id="selling_price"
            name="selling_price"
            type="number"
            value={formData.selling_price}
            onChange={handleChange}
            min={formData.buying_price > 0 ? formData.buying_price + 0.01 : 0.01}
            step={0.01}
            required
          />
        </div>
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          className="bg-primary text-white w-full" 
          disabled={loading}
        >
          {loading ? "Adding..." : "Add to Inventory"}
        </Button>
      </div>
    </form>
  );
};

export default AddInventoryForm;
