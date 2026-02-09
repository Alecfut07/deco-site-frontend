import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import unclePhoto from "@/assets/uncle-photo.jpeg";
import { AboutSkeleton } from "@/components/SkeletonSection";
import { useBusinessInfo } from "../services/api";

const About = () => {
  const { data: businessInfo, isLoading } = useBusinessInfo();

  if (isLoading) {
    return <AboutSkeleton />;
  }

  const specialtiesList = businessInfo?.specialties?.split(", ") || [];

  return (
    <section id="about" className="py-20 bg-subtle-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About Me
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Building trust through quality and craftsmanship
          </p>
        </motion.div>

        {/* Profile: photo + intro */}
        <motion.div
          className="flex flex-col md:flex-row gap-12 items-center max-w-5xl mx-auto mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-shrink-0">
            {unclePhoto ? (
              <img
                src={unclePhoto}
                alt="Ortega Reyes - Professional remodeling and restoration"
                className="w-64 h-64 md:w-80 md:h-80 rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-6xl font-bold text-primary/30">OR</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-lg text-foreground leading-relaxed mb-6">
              {businessInfo?.description ||
                "Ortega Reyes Remodeling and Restoration has been transforming homes with exceptional craftsmanship and dedication for over 25 years. Our team of skilled professionals brings expertise, attention to detail, and a commitment to satisfaction to every project."}
            </p>
            {specialtiesList.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {specialtiesList.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-foreground text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {specialty.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
