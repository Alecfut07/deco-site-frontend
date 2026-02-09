import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bath, ChefHat, Home, Wrench, Paintbrush, Hammer } from "lucide-react";
import { motion } from "motion/react";
import { ServicesSkeleton } from "@/components/SkeletonSection";
import { cn } from "@/lib/utils";
import { useServices } from "../services/api";

// Icon mapping for services
const categoryIcons = {
  Bathrooms: Bath,
  Kitchens: ChefHat,
  Interior: Paintbrush,
  Exterior: Wrench,
  default: Home,
};

const Services = () => {
  const { data: servicesData = [], isLoading } = useServices();

  if (isLoading) {
    return <ServicesSkeleton />;
  }

  // Handle both array and paginated response formats
  const services = Array.isArray(servicesData)
    ? servicesData
    : servicesData.results || [];

  // Group services by category
  const categories = [
    ...new Set(
      services.filter((s) => s.is_active).map((s) => s.category?.name),
    ),
  ];
  const servicesByCategory = {};
  categories.forEach((cat) => {
    servicesByCategory[cat] = services.filter(
      (s) => s.category?.name === cat && s.is_active,
    );
  });

  // Filter out null/undefined categories
  const categories = [
    ...new Set(
      services
        .filter((s) => s.is_active && s.category?.name)
        .map((s) => s.category.name),
    ),
  ].filter(Boolean);

  const servicesByCategory = {};
  categories.forEach((cat) => {
    servicesByCategory[cat] = services.filter(
      (s) => s.category?.name === cat && s.is_active,
    );
  });

  const hasServices = categories.length > 0;
  const [selectedCategory, setSelectedCategory] = useState(
    categories[0] ?? null,
  );

  // Sync selectedCategory when categories load (e.g. after fetch)
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
    if (categories.legnth > 0 && !categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  return (
    <section id="services" className="py-20 bg-subtle-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive remodeling and restoration solutions tailored to your
            needs
          </p>
        </motion.div>

        {hasServices ? (
          <>
            {/* Category tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {categories.map((category) => {
                const Icon =
                  categoryIcons[category] || categoryIcons["default"];
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Services grid for selected category */}
            {selectedCategory && servicesByCategory[selectedCategory] && (
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {servicesByCategory[selectedCategory].map((service) => (
                  <Card
                    key={service.id}
                    className="hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {service.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center py-16 rounded-lg border border-dashed border-muted-foreground/30 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Wrench className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
              No services available yet
            </p>
            <p className="text-sm">
              Check back soon for our service offerings.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Services;
