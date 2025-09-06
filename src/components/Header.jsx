import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white/98 backdrop-blur-md shadow-lg' : 'bg-white/95 backdrop-blur-sm'
        }`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-4">
                    <div className="text-2xl font-bold text-gray-800">
                        Uncle's Decorations
                    </div>

                    <nav className={`hidden md:flex space-x-8`}>
                        <a href="#home" onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-primary-500 transition-colors">Home</a>
                        <a href="#services" onClick={() => scrollToSection('services')} className="text-gray-600 hover:text-primary-500 transition-colors">Services</a>
                        <a href="#portfolio" onClick={() => scrollToSection('portfolio')} className="text-gray-600 hover:text-primary-500 transition-colors">Portfolio</a>
                        <a href="#about" onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-primary-500 transition-colors">About</a>
                        <a href="#contact" onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-primary-500 transition-colors">Contact</a>
                    </nav>

                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <nav className="flex flex-col space-y-4">
                            <a href="#home" onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-primary-500 transition-colors py-2">Home</a>
                            <a href="#services" onClick={() => scrollToSection('services')} className="text-gray-600 hover:text-primary-500 transition-colors py-2">Services</a>
                            <a href="#portfolio" onClick={() => scrollToSection('portfolio')} className="text-gray-600 hover:text-primary-500 transition-colors py-2">Portfolio</a>
                            <a href="#about" onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-primary-500 transition-colors py-2">About</a>
                            <a href="#contact" onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-primary-500 transition-colors py-2">Contact</a>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;