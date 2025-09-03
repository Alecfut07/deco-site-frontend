import { motion } from 'motion';
import { Phone, MapPin, Clock } from 'lucide-react';
import { fadeInUp, staggerChildren } from '../utils/animations';

const Hero = () => {
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500 text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="container relative z-10">
                <motion.div
                    className="text-center max-w-4xl mx-auto"
                    initial="initial"
                    animate="animate"
                    variants={staggerChildren}
                >
                    <motion.h1
                        className="text-5xl md:text-6xl font-bold mb-6"
                        variants={fadeInUp}
                    >
                        Professional House Decoration Services
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed"
                        variants={fadeInUp}
                    >
                        Transforming homes iwth over 10 years of experience and thousandsof satisfied customers
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                        variants={fadeInUp}
                    >
                        <motion.button
                            className="btn-primary"
                            onClick={() => document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' })}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            View Our Work
                        </motion.button>
                        <motion.button
                            className="btn-secondary"
                            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get Quote
                        </motion.button>

                        <motion.div
                            className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8"
                            variants={fadeInUp}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Phone size={20} />
                                <span>(555) 123-4567</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <MapPin size={20} />
                                <span>Your City, State</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <Clock size={20} />
                                <span>Mon-Fri: 8AM - 6PM</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;