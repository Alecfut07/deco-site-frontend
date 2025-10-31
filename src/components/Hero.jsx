import { Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBusinessInfo } from '../services/api';

const Hero = () => {
    const { data: businessInfo, isLoading } = useBusinessInfo();

    return (
        <section id="home" className="relative min-h-screen flex items-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                {businessInfo?.hero_background_url ? (
                    <img 
                        src={getImageUrl(businessInfo.hero_background_url)}
                        alt="Beautiful home renovation"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
            </div>

            {/* Content */}
            <div className="container relative z-10 mx-auto px-4 py-20">
                <div className="max-w-4xl animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
                        {businessInfo?.company_name || 'Ortega Reyes Remodeling and Restoration'}
                    </h1>
                    <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4">
                        {businessInfo?.tagline || 'Transforming Homes with Excellence'}
                    </p>
                    <p className="text-lg text-primary-foreground/80 mb-8">
                        Over {businessInfo?.years_experience || 25} years of craftsmanship and quality service
                    </p>

                    {/* Contact Info */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        {businessInfo?.phone && (
                            <a
                                href={`tel:${businessInfo.phone.replace(/[^0-9]/g, '')}`}
                                className="flex items-center gap-2 text-primary-foreground hover:text-accent transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                <span className="text-lg font-medium">{businessInfo.phone}</span>
                            </a>
                        )}
                        {businessInfo?.email && (
                            <a
                                href={`mailto:${businessInfo.email}`}
                                className="flex items-center gap-2 text-primary-foreground hover:text-accent transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                                <span className="text-lg font-medium">{businessInfo.email}</span>
                            </a>
                        )}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {businessInfo?.phone && (
                            <Button
                                size="lg"
                                className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                                asChild
                            >
                                <a href={`tel:${businessInfo.phone.replace(/[^0-9]/g, '')}`}>
                                    <Phone className="w-5 h-5 mr-2" />
                                    Call Now
                                </a>
                            </Button>
                        )}
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-primary-foreground text-primary border-2 hover:bg-primary-foreground/90 text-lg px-8 py-6"
                            asChild
                        >
                            <a>View Portfolio</a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
