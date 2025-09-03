import { useState } from 'react';
import { motion, AnimatePresence } from 'motion';
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useSearchAndFilter, useCategories } from "../services/api";
import { fadeInUp, staggerChildren, hoverScale } from "../utils/animations";
import ImageLightbox from "./ImageLightbox";

const Portfolio = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showLightbox, setShowLightbox] = useState(false);

    const pageSize = 12;

    // Use TanStack Query hooks
    const { data: categories = [], isLoading: categoriesLoading } = useCategories();
    const {
        data: portfolioData = [],
        isLoading: portfolioLoading,
        error: portfolioError,
    } = useSearchAndFilter(searchQuery, { category: selectedCategory }, currentPage, pageSize);
    
    const portfolioItems = portfolioData?.results || [];
    const totalPages = Math.ceil((portfolioData?.count || 0) / pageSize);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category === selectedCategory ? '' : category);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setCurrentPage(1);
    };

    const openLightbox = (item) => {
        setSelectedImage(item);
        setShowLightbox(true);
    };
    
    const closeLightbox = () => {
        setShowLightbox(false);
        setSelectedImage(null);
    };

    return (
        <section id="portfolio" className="py-24 bg-white">
            <div className="container">
                <motion.div
                    className="text-center mb-16"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <h2 className="section-title">Our Portfolio</h2>
                    <p className="section-subtitle">
                        Explore our extensive collection of completed projects
                    </p>
                </motion.div>

                {/* Search and Filter Controls */}
                <motion.div
                    
                >
                    <form></form>
                </motion.div>
            </div>
        </section>
    )
}