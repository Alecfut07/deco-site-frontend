import { Phone, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useBusinessInfo } from "../services/api";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  const { data: businessInfo, isLoading } = useBusinessInfo();

  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackground}
          alt="Beautiful home renovation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {businessInfo?.company_name ||
              "Ortega Reyes Remodeling and Restoration"}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-primary-foreground/90 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {businessInfo?.tagline || "Transforming Homes with Excellence"}
          </motion.p>
          <motion.p
            className="text-lg text-primary-foreground/80 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Over {businessInfo?.years_experience || 25} years of craftsmanship
            and quality service
          </motion.p>

          {/* Contact Info */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {businessInfo?.phone && (
              <a
                href={`tel:${businessInfo.phone.replace(/[^0-9]/g, "")}`}
                className="flex items-center gap-2 text-primary-foreground hover:text-accent transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="text-lg font-medium">
                  {businessInfo.phone}
                </span>
              </a>
            )}
            {businessInfo?.email && (
              <a
                href={`mailto:${businessInfo.email}`}
                className="flex items-center gap-2 text-primary-foreground hover:text-accent transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="text-lg font-medium">
                  {businessInfo.email}
                </span>
              </a>
            )}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {businessInfo?.phone && (
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <a href={`tel:${businessInfo.phone.replace(/[^0-9]/g, "")}`}>
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
              <a href="#portfolio">View Portfolio</a>
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <a
            href="#services"
            className="flex flex-col items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            aria-label="Scroll down"
          >
            <span className="text-xs font-medium">Scroll</span>
            <ChevronDown className="w-8 h-8 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
