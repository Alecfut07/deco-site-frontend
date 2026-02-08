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

  const hasServices = categories.filter(Boolean).length > 0;

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
          categories.map((category) => {
            const Icon = categoryIcons[category] || categoryIcons["default"];

            return (
              <motion.div
                key={category}
                className="mb-12"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="w-8 h-8 text-primary" />
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                    {category}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {servicesByCategory[category].map((service) => (
                    <Card
                      key={service.id}
                      className="hover:shadow-lg transition-shadow duration-300"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {service.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">
                          {service.description}
                        </CardDescription>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <a href="#contact">Contact for Quote</a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            );
          })
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
