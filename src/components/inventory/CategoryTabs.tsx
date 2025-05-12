
import { Button } from "@/components/ui/button";

interface CategoryTabsProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryTabs = ({ activeCategory, setActiveCategory }: CategoryTabsProps) => {
  const categories = [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "slippers", label: "Slippers" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          className={`rounded-custom ${
            activeCategory === category.id
              ? "bg-primary hover:bg-primary/90"
              : "hover:bg-gray"
          }`}
          onClick={() => setActiveCategory(category.id)}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryTabs;
