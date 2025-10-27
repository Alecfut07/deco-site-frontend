import { motion } from 'motion/react';
import { Award, Users, Clock, Star, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBusinessInfo } from '../services/api';

const About = () => {
    const { data: businessInfo, isLoading } = useBusinessInfo();

    if (isLoading) {
        return (
            <section id="about" className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            </section>
        );
    }

    const specialties = businessInfo?.specialties?.split(', ') || [];

    return (
        <section id="about" className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">About Our Business</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {businessInfo?.description || 'Professional remodeling and restoration services'}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                    {/* Left side - Text content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">
                            {businessInfo?.company_name || 'Ortega Reyes Remodeling and Restoration'}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            With over <strong>{businessInfo?.years_experience || 25} years</strong> of experience in remodeling and restoration,
                            we have transformed hundreds of homes across the region. Our commitment to quality, attention to detail,
                            and customer satisfaction has made us the preferred choice for homeowners  seeking professional remodeling services.
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            We specialize in both interior and exterior remodeling, offering a comprehensive
                            range of services from basic painting to complete home makeovers. Our team of
                            skilled professionals uses only the highest quality materials and the latest
                            techniques to ensure exceptional results.
                        </p>

                        {/* Specialties */}
                        <div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-3">Our Specialties:</h4>
                            <div className="flex flex-wrap gap-2">
                                {specialties.map((specialty, index) => (
                                    <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        {specialty}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right side - Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="grid grid-cols-2 gap-6">
                            <Card className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Award className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div className="text-4xl font-bold text-gray-800 mb-2">
                                        {businessInfo?.years_experience || 25} + 
                                    </div>
                                    <div className="text-gray-600 font-medium">Years Experience</div>
                                </CardContent>
                            </Card>

                            <Card className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="w-8 h-8 text-green-600" />
                                    </div>
                                    <div className="text-4xl font-bold text-gray-800 mb-2">500+</div>
                                    <div className="text-gray-600 font-medium">Happy Customers</div>
                                </CardContent>
                            </Card>

                            <Card className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Clock className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <div className="text-4xl font-bold text-gray-800 mb-2">5.0</div>
                                    <div className="text-gray-600 font-medium">Average Rating</div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </div>

                {/* Tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center"
                >
                    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <CardContent className="py-12">
                            <p className="text-2xl md:text-3xl font-bold mb-4">
                                {businessInfo?.tagline || "Quality craftsmanship for 25 years"}
                            </p>
                            <p className="text-lg opacity-90">
                                Transforming houses into homes, one project at a time.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    )
};

export default About;