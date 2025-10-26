import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Paintbrush, Brush, Wrench, Hammer, Droplet } from 'lucide-react';
import { useServices } from '../services/api';

// Icon mapping for services
const iconMap = {
    'Interior Painting': Paintbrush,
    'Exterior Painting': Home,
    'Shower Installation/Renovation': Droplet,
    'Tiling': Hammer,
    'Hardwood Flooring Installation': Wrench,
    'Vinyl Flooring Installation': Wrench,
    'Drywall Finishing': Brush,
    'Plumbing Services': Droplet,
    'default': Wrench,
};

const Services = () => {
    const { data: services = [], isLoading, error } = useServices();

    // Group services by category
    const groupedServices = services.reduce((acc, service) => {
        const categoryName = service.category?.name || 'Other';
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(service);
        return acc;
    }, {});

    if (isLoading) {
        return (
            <section id="services" className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading services...</p>
                    </div>
                </div>
            </section>
        );
    }
    
    return (
        <section id="services" className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Professional remodeling and restoration services tailored to your needs
                    </p>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.filter(service => service.is_active).map((service, index) => {
                        const IconComponent = iconMap[service.name] || iconMap['default'];

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow">
                                    <CardHeader className="text-center">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <IconComponent className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <CardTitle className="text-xl">{service.name}</CardTitle>
                                        <CardDescription className="text-gray-600">
                                            {service.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-center">
                                        {service.category && (
                                            <Badge variant="secondary" className="mb-2">
                                                {service.category.name}
                                            </Badge>
                                        )}
                                        <p className="text-sm text-gray-500 mt-2">{service.price_range}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Services;