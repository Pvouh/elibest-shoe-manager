
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/inventoryUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface AnalyticsData {
  totalItems: number;
  totalValue: number;
  averageProfit: number;
  inventoryByCategory: {
    category: string;
    count: number;
    value: number;
  }[];
  profitByCategory: {
    category: string;
    totalProfit: number;
  }[];
}

const COLORS = ["#8B5CF6", "#EC4899", "#F97316", "#0EA5E9"];

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalItems: 0,
    totalValue: 0,
    averageProfit: 0,
    inventoryByCategory: [],
    profitByCategory: [],
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Get all inventory items
        const { data, error } = await supabase
          .from('inventory')
          .select('*');

        if (error) throw error;
        
        const items = data || [];
        
        if (items.length === 0) {
          setLoading(false);
          return;
        }
        
        // Calculate total items and value
        const totalItems = items.length;
        const totalValue = items.reduce((sum, item) => sum + (item.selling_price * item.stock), 0);
        
        // Calculate average profit
        const totalProfit = items.reduce((sum, item) => sum + item.profit, 0);
        const averageProfit = totalProfit / totalItems;
        
        // Group items by category
        const categoryMap = new Map();
        const profitMap = new Map();
        
        items.forEach(item => {
          const category = item.category || 'unknown';
          
          // For inventory count and value
          if (!categoryMap.has(category)) {
            categoryMap.set(category, { count: 0, value: 0 });
          }
          const categoryData = categoryMap.get(category);
          categoryData.count += 1;
          categoryData.value += (item.selling_price * item.stock);
          
          // For profit by category
          if (!profitMap.has(category)) {
            profitMap.set(category, 0);
          }
          profitMap.set(category, profitMap.get(category) + item.profit);
        });
        
        const inventoryByCategory = Array.from(categoryMap.entries()).map(([category, data]) => ({
          category,
          count: data.count,
          value: data.value,
        }));
        
        const profitByCategory = Array.from(profitMap.entries()).map(([category, totalProfit]) => ({
          category,
          totalProfit,
        }));
        
        setAnalyticsData({
          totalItems,
          totalValue,
          averageProfit,
          inventoryByCategory,
          profitByCategory
        });
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-text/70">Loading analytics data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-text/70">
          Track your sales performance and inventory metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">
              {analyticsData.totalItems}
            </CardTitle>
            <CardDescription>Total Inventory Items</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-primary">
              {formatCurrency(analyticsData.totalValue)}
            </CardTitle>
            <CardDescription>Total Inventory Value</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-green-600">
              {formatCurrency(analyticsData.averageProfit)}
            </CardTitle>
            <CardDescription>Average Profit per Item</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="inventory">Inventory By Category</TabsTrigger>
          <TabsTrigger value="profit">Profit By Category</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Inventory Distribution</h2>
          
          {analyticsData.inventoryByCategory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Items By Category</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.inventoryByCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                      <Bar dataKey="count" fill="#8B5CF6" name="Items" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Value By Category</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.inventoryByCategory}
                        dataKey="value"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => `${entry.category}: ${formatCurrency(entry.value)}`}
                      >
                        {analyticsData.inventoryByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-center text-text/60 py-12">
              No inventory data available. Add some inventory items to see analytics.
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="profit" className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Profit Analysis</h2>
          
          {analyticsData.profitByCategory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Profit By Category</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.profitByCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis tickFormatter={(value) => `KES ${value}`} />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), 'Profit']} />
                      <Bar dataKey="totalProfit" fill="#10B981" name="Profit" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Profit Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.profitByCategory}
                        dataKey="totalProfit"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => `${entry.category}: ${formatCurrency(entry.totalProfit)}`}
                      >
                        {analyticsData.profitByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-center text-text/60 py-12">
              No profit data available. Add some inventory items to see analytics.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Analytics;
