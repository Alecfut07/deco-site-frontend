import { Award, Users, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useBusinessInfo } from '../services/api';

const About = () => {
    const { data: businessInfo, isLoading } = useBusinessInfo();

    if (isLoading) {
        return (
            <section id="about" className="py-20 bg-subtle-gradient">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="mt-4 text-muted-foreground">Loading...</p>
                    </div>
                </div>
            </section>
        );
    }

    const specialtiesList = businessInfo?.specialties?.split(', ') || [];

    const stats = [
        { icon: Award, label: 'Years of Excellence', value: `${businessInfo?.years_experience || 25}+` },
        { icon: Users, label: 'Happy Clients', value: '500+' },
        { icon: CheckCircle2, label: 'Projects Completed', value: '1000+' },
    ];

    return (
        <section id="about" className="py-20 bg-subtle-gradient">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        About Us
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Building trust through, quality and craftsmanship
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-fade-in-up">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="pt-6">
                                    <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                                    <div className="text-muted-foreground">{stat.label}</div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Description */}
                <div className="max-w-4xl mx-auto mb-12 animate-fade-in">
                    <p className="text-lg text-foreground leading-relaxed mb-8">
                        {businessInfo?.description || 'Ortega Reyes Remodeling and Restoration has been transforming homes with exceptional caraftsmanship and dedication for over 25 years. Our team of skilled professionals brings expertise, attention to detail, and a commitment to satisfaction to every project.'}
                    </p>

                    {specialtiesList.length > 0 && (
                        <div>
                            <h3 className="text-2xl font-bold text-foreground mb-4">Our Specialties</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {specialtiesList.map((specialty, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                        <span className="text-foreground">{specialty}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default About;