import { Phone, Mail, MapPin } from "lucide-react";
import { useBusinessInfo } from "../services/api";

const Footer = () => {
  const { data: businessInfo, isLoading } = useBusinessInfo();
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-xl mb-4">Ortega Reyes Remodeling</h3>
            <p className="text-primary-foreground/80 mb-4">
              Over {businessInfo?.years_experience || 25} years of excellence in
              home remodeling and restoration
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "#home", label: "Home" },
                { href: "#services", label: "Services" },
                { href: "#portfolio", label: "Portfolio" },
                { href: "#about", label: "About" },
                { href: "#contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-primary-foreground/80 hover:text-accent transition-colors"
                    onClick={(e) => handleLinkClick(e, href)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <a
                  href={`tel:${businessInfo?.phone?.replace(/[^0-9]/g, "") || "7204343254"}`}
                  className="hover:text-accent transition-colors"
                >
                  {businessInfo?.phone || "(720) 434-3254"}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <a
                  href={`mailto:${businessInfo?.email || "alo_57@live.com"}`}
                  className="hover:text-accent transition-colors"
                >
                  {businessInfo?.email || "alo_57@live.com"}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                <span className="text-primary-foreground/80">
                  {businessInfo?.address || "Denver, CO"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/80">
          <p>
            &copy; {currentYear} Ortega Reyes Remodeling and Restoration. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
