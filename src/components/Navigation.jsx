import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '#home', label: 'Home' },
        { href: '#services', label: 'Services' },
        { href: '#portfolio', label: 'Portfolio' },
        { href: '#about', label: 'About' },
        { href: '#contact', label: 'Contact' },
    ];

    const handleNavClick = (href) => {
        setIsMobileMenuOpen(false);
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-background/95 backdrop-blur-sm shadow-md'
                    : 'bg-transparent'
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <a
                        href="#home"
                        className={cn(
                            'font-bold text-xl transition-colors',
                            isScrolled ? 'text-foreground' : 'text-primary-foreground'
                        )}
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick('#home');
                        }}
                    >
                        Ortega Reyes
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'font-medium transition-colors hover:text-accent',
                                    isScrolled ? 'text-foreground' : 'text-primary-foreground'
                                )}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavClick(link.href);
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                        <Button
                            className="bg-accent hover:bg-accent/90"
                            asChild
                        >
                            <a href="tel:7204343254">Call Now</a>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            'md:hidden',
                            isScrolled ? 'text-foreground' : 'text-primary-foreground'
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
                                        className="font-medium text-foreground hover:text-accent transition-colors px-4 py-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavClick(link.href);
                                        }}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <Button
                                    className="bg-accent hover:bg-accent/90 mx-4"
                                    asChild
                                >
                                    <a href="tel:7204343254">Call Now</a>
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
