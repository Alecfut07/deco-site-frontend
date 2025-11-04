import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bath, ChefHat, Home, Wrench, Paintbrush, Hammer } from 'lucide-react';
import { useServices } from '../services/api';

// Icon mapping for services
const categoryIcons = {
    'Bathrooms': Bath,
    'Kitchens': ChefHat,
    'Interior': Paintbrush,
    'Exterior': Wrench,
    'default': Home
};

const Services = () => {
    const { data: services = [], isLoading } = useServices();

    if (isLoading) {
        return (
            <section id="services" className="py-20 bg-subtle-gradient">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p>Loading services...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Group services by category
    const categories = [...new Set(services.filter(s => s.is_active).map(s => s.category?.name))];
    const servicesByCategory = {};
    categories.forEach(cat => {
        servicesByCategory[cat] = services.filter(s => s.category?.name === cat && s.is_active);
    });

    return (
        <section id="services" className="py-20 bg-subtle-gradient">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Our Services
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Comprehensive remodeling and restoration solutins tailored to your needs
                    </p>
                </div>

                {categories.map((category) => {
                    const Icon = categoryIcons[category] || categoryIcons['default'];

                    return (
                        <div key={category} className="mb-12 animate-fade-in-up">
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
                                            <CardTitle className="text-lg">{service.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="mb-4">
                                                {service.description}
                                            </CardDescription>
                                            <Button variant="outline" size="sm" className="w-full" asChild>
                                                <a href="#contact">Contact for Quote</a>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Services;