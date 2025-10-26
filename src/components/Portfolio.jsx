import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { usePortfolioItems, useCategories, useSearchAndFilter, getImageUrl } from "../services/api";
import ImageLightbox from "./ImageLightbox";

const Portfolio = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showLightbox, setShowLightbox] = useState(false);

    const pageSize = 12;

    // Fetch categories
    const { data: categories = [], isLoading: categoriesLoading } = useCategories();

    // Determine which query to use based on filters
    const hasFilters = searchQuery || selectedCategory;
    
    // Use combined search/filter when filters are active
    const {
        data: filteredData,
        isLoading: filteredLoading,
        error: filteredError,
    } = useSearchAndFilter(searchQuery, selectedCategory, currentPage, pageSize);
    
    // Use regular portfolio items when no filters
    const {
        data: regularData,
        isLoading: regularLoading,
        error: regularError
    } = usePortfolioItems(currentPage, pageSize);

    // Determine which data to use
    const portfolioData = hasFilters ? filteredData : regularData;
    const isLoading = hasFilters ? filteredLoading : regularLoading;
    const error = hasFilters ? filteredError : regularError;

    const portfolioItems = portfolioData?.portfolio_items || [];
    const pagination = portfolioData?.pagination || {};

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
            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Portfolio</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore our extensive collection of completed projects
                    </p>
                </motion.div>

                {/* Search and Filter Controls */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="flex max-w-lg mx-auto gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <Input 
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </div>
                    </form>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                            <Button
                                variant={selectedCategory === '' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleCategoryFilter('')}
                            >
                                All
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant={selectedCategory === category.name ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleCategoryFilter(category.name)}
                                >
                                    {category.name}
                                </Button>
                            ))}
                        </div>

                        {(searchQuery || selectedCategory) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-gray-500"
                            >
                                <X size={16} className="mr-2" />
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Portfolio Grid */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading portfolio...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-600">Error loading portfolio. Please try again.</p>
                    </div>
                ) : portfolioItems.length > 0 ? (
                    <>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <AnimatePresence>
                                {portfolioItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        whileHover={{ y: -5 }}
                                        className="cursor-pointer"
                                        onClick={() => openLightbox(item)}
                                    >
                                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="aspect-[4/3] overflow-hidden relative">
                                                <img
                                                    src={getImageUrl(item.thumbnail_url)}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                                {item.has_before_after && (
                                                    <Badge className="absolute top-2 right-2 bg-blue-600">
                                                        Before/After
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.title}</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.category && (
                                                        <Badge variant="secondary">{item.category.name}</Badge>
                                                    )}
                                                    {item.service && (
                                                        <Badge variant="outline">{item.service.name}</Badge>
                                                    )}
                                                </div>
                                                {item.image_count > 0 && (
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        +{item.image_count} more {item.image_count === 1 ? 'photo' : 'photos'}
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Pagination */}
                        {pagination.total_pages > 1 && (
                            <motion.div
                                className="flex justify-center items-center gap-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={!pagination.has_previous}
                                >
                                    <ChevronLeft size={20} className="mr-2" />
                                    Previous
                                </Button>

                                <Badge variant="outline" className="px-4 py-2">
                                    Page {pagination.page} of {pagination.total_pages}
                                </Badge>

                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    disabled={!pagination.has_next}
                                >
                                    Next
                                    <ChevronRight size={20} className="ml-2" />
                                </Button>
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
            <AnimatePresence>
                {showLightbox && selectedImage && (
                    <ImageLightbox
                        item={selectedImage}
                        onClose={closeLightbox}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default Portfolio;