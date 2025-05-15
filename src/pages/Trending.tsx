
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/inventoryUtils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp } from "lucide-react";

interface TrendingItem {
  id: string;
  shoe_name: string;
  category: string;
  selling_price: number;
  profit: number;
  size: string | number;
  stock: number;
}

const Trending = () => {
  const [loading, setLoading] = useState(true);
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);

  // Fetch trending items (highest profit margin items)
  useEffect(() => {
    const fetchTrendingItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('inventory')
          .select('*')
          .order('profit', { ascending: false })
          .limit(10);

        if (error) {
          throw error;
        }

        setTrendingItems(data || []);
      } catch (error) {
        console.error("Error fetching trending items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingItems();
  }, []);

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Trending Products</h1>
          <TrendingUp className="text-green-500" size={24} />
        </div>
        <p className="text-text/70 mt-2">
          Top selling shoes with highest profit margins for this season.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        {loading ? (
          <p className="text-center text-text/60">Loading trending products...</p>
        ) : trendingItems.length > 0 ? (
          <Table>
            <TableCaption>Top 10 trending shoes by profit margin</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Shoe Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Available Stock</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Profit Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trendingItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/20">
                  <TableCell className="font-medium">{item.shoe_name}</TableCell>
                  <TableCell className="capitalize">{item.category}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>{formatCurrency(item.selling_price)}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatCurrency(item.profit)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-text/60">
            No trending items found. Add inventory to get started.
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Trending;
