import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Paintbrush, Brush } from 'lucide-react';

const Services = () => {
    const services = [
        {
            id: 1,
            title: 'Interior Decoration',
            description: 'Complete interior design and decoration services to transform your living spaces',
            icon: Home,
            features: ['Living Room Design', 'Bedroom Makeover', 'Kitchen Renovation']
        },
        {
            id: 2,
            title: 'Exterior Painting',
            description: 'Professional exterior painting and finishing services for your home',
            icon: Paintbrush,
            features: ['House Painting', 'Deck Staining', 'Fence Painting']
        },
        {
            id: 3,
            title: 'Custom Finishes',
            description: 'Specialized decorative finishes and techniques for unique results',
            icon: Brush,
            features: ['Textured Walls', 'Faux Finishes', 'Custom Colors']
        }
    ];
    
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
                        Professional decoration services tailored to your needs
                    </p>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <service.icon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-xl">{service.title}</CardTitle>
                                    <CardDescription className="text-gray-600">
                                        {service.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {service.features.map((feature, idx) => (
                                            <Badge key={idx} variant="secondary" className="mr-2 mb-2">
                                                {feature}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;