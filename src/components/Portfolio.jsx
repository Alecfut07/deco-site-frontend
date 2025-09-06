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
                    className="mb-12"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    vairants={fadeInUp}
                >
                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="flex max-w-lg mx-auto bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                            <Search size={20} className="m-4 text-gray-500" />
                            <input 
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-4 py-4 text-lg outline-none"
                            />
                            <button type="submit" className="bg-primary-500 text-white px-6 py-4 font-medium hover:bg-primary-600 transition-colors">
                                Search
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                            <button
                                className={`px-6 py-2 rounded-full font-medium transition-all ${
                                    selectedCategory === ''
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                onClick={() => handleCategoryFilter('')}
                            >
                                All
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    className={`px-6 py-2 rounded full font-medium transition-all ${
                                        selectedCategory === category.slug
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                    onClick={() => handleCategoryFilter(category.slug)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {(searchQuery || selectedCategory) && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <X size={16} />
                                Clear Filters
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Portfolio Grid */}
                {portfolioLoading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                        <p className="mt-4 text-gray-600">Loading portfolio...</p>
                    </div>
                ) : portfolioError ? (
                    <div className="text-center py-12">
                        <p className="text-red-600">Error loading portfolio. Please try again.</p>
                    </div>
                ) : portfolioItems.length > 0 ? (
                    <>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
                            initial="initial"
                            animate="animate"
                            variants={staggerChildren}
                        >
                            <AnimatePresence>
                                {portfolioItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        className="group cursor-pointer"
                                        variants={fadeInUp}
                                        whileHover={{ y: -5 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={() => openLightbox(item)}
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                                            <img 
                                                src={item.image}
                                                alt={item.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                                                    <p className="text-sm opacity-80">{item.category?.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <motion.div
                                className="flex justify-center items-center gap-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                    Previous
                                </button>

                                <div className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium">
                                    Page {currentPage} of {totalPages}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                    <ChevronRight size={20} />
                                </button>
                            </motion.div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No portfolio items found. Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            {/* Image Lightbox */}
        </section>
    )
}