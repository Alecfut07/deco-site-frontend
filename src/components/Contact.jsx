import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { ContactSkeleton } from "@/components/SkeletonSection";
import { useBusinessInfo } from "../services/api";

const Contact = () => {
  const { data: businessInfo, isLoading } = useBusinessInfo();

  if (isLoading) {
    return <ContactSkeleton />;
  }

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your home? Contact me today for a free
            consultation
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up">
            {/* Phone */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <Phone className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Phone</h3>
                <a
                  href={`tel:${businessInfo?.phone?.replace(/[^0-9]/g, "") || "7204343254"}`}
                  className="text-primary hover:underline"
                >
                  {businessInfo?.phone || "(720) 434-3254"}
                </a>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <Mail className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <a
                  href={`mailto:${businessInfo?.email || "alo_57@live.com"}`}
                  className="text-primary hover:underline break-all"
                >
                  {businessInfo?.email || "alo_57@live.com"}
                </a>
              </CardContent>
            </Card>

            {/* Service Area */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Service Area</h3>
                <p className="text-muted-foreground text-sm">
                  {businessInfo?.address || "Denver, CO"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
              asChild
            >
              <a
                href={`tel:${businessInfo?.phone?.replace(/[^0-9]/g, "") || "7204343254"}`}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              asChild
            >
              <a href={`mailto:${businessInfo?.email || "alo_57@live.com"}`}>
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
