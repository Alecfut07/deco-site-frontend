import { motion } from 'motion/react';
import { Phone, MapPin, Clock, Mail, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBusinessInfo } from '../services/api';

const Contact = () => {
    const { data: businessInfo, isLoading } = useBusinessInfo();

    if (isLoading) {
        return (
            <section id="contact" className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            </section>
        );
    }

    const contactInfo = [
        {
            icon: Phone,
            title: 'Phone',
            content: businessInfo?.phone || '(720) 434-3254',
            action: `tel:${businessInfo?.phone?.replace(/[^0-9]/g, '')}`,
            description: 'Call us for immediate assistance'
        },
        {
            icon: Mail,
            title: 'Email',
            content: businessInfo?.email || 'alo_57@live.com',
            action: `mailto:${businessInfo?.email}`,
            description: 'Send us your project details'
        },
        {
            icon: MapPin,
            title: 'Location',
            content: businessInfo?.address || 'Serving Denver, CO',
            action: null,
            description: 'Serving area'
        },
        {
            icon: Clock,
            title: 'Business Hours',
            content: 'Monday - Friday: 8:00 AM - 6:00 PM',
            subContent: 'Saturday: Closed | Sunday: Closed',
            action: null,
            description: 'Contact us during business hours'
        }
    ];

    return (
        <section id="contact" className="py-24 bg-white">
            <div></div>
        </section>
    )
};

export default Contact;