import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBusinessInfo } from "../services/api";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: businessInfo } = useBusinessInfo();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home", id: "home" },
    { href: "#services", label: "Services", id: "services" },
    { href: "#portfolio", label: "Portfolio", id: "portfolio" },
    { href: "#about", label: "About", id: "about" },
    { href: "#contact", label: "Contact", id: "contact" },
  ];

  const handleNavClick = (href) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const sections = ["home", "services", "portfolio", "about", "contact"];

    const updateActiveSection = () => {
      const scrollY = window.scrollY;
      const offset = 120; // Pixels from top of viewport; adjust for nav height

      let current = "home";
      for (const id of sections) {
        const el = document.getElementById(id);

        if (el) {
          const { top } = el.getBoundingClientRect();
          // Section is active when its top has passed our offset line
          if (top <= offset) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    updateActiveSection(); // Run on mount
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-md"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#home"
            className={cn(
              "font-bold text-xl transition-colors",
              isScrolled ? "text-foreground" : "text-primary-foreground",
            )}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#home");
            }}
          >
            {businessInfo?.company_name?.split(" ").slice(0, 2).join(" ") ||
              "Ortega Reyes"}
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "font-medium transition-colors",
                  activeSection === link.id
                    ? "text-accent"
                    : isScrolled
                      ? "text-foreground hover:text-accent"
                      : "text-primary-foreground hover:text-accent",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
              >
                {link.label}
              </a>
            ))}
            <Button className="bg-accent hover:bg-accent/90" asChild>
              <a
                href={`tel:${(businessInfo?.phone || "7204343254").replace(/[^0-9]/g, "")}`}
              >
                Call Now
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "md:hidden",
              isScrolled ? "text-foreground" : "text-primary-foreground",
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 bg-background border-t animate-fade-in">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "font-medium transition-colors px-4 py-2",
                      activeSection === link.id
                        ? "text-accent"
                        : isScrolled
                          ? "text-foreground hover:text-accent"
                          : "text-primary-foreground hover:text-accent",
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                  >
                    {link.label}
                  </a>
                ))}
                <Button className="bg-accent hover:bg-accent/90 mx-4" asChild>
                  <a
                    href={`tel:${(businessInfo?.phone || "7204343254").replace(/[^0-9]/g, "")}`}
                  >
                    Call Now
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
