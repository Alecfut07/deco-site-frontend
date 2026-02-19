import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getImageUrl } from '../services/api';
import BeforeAfterSlider from './BeforeAfterSlider';

const ImageLightbox = ({ item, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showBeforeAfter, setShowBeforeAfter] = useState(item.has_before_after);

    // Combine all images
    const allImages = [
        item.gallery_image_url || item.image_url,
        ...(item.images || [])
    ];

    const goToPrevious = () => {
        setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : allImages.length - 1));
        setShowBeforeAfter(false);
    };

    const goToNext = () => {
        setCurrentImageIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0));
        setShowBeforeAfter(false);
    };
    
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="relative max-w-6xl max-h-[90vh] w-full bg-white rounded-xl overflow-hidden"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>

                    {/* Navigation Buttons */}
                    {allImages.length > 1 && !showBeforeAfter && (
                        <>
                            <button
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                                onClick={goToPrevious}
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                                onClick={goToNext}
                            >
                                <ChevronLeft size={24} />
                            </button>
                        </>
                    )}

                    <div className="max-h-[60vh] overflow-hidden">
                        {showBeforeAfter && item.has_before_after ? (
                            <BeforeAfterSlider 
                                beforeImage={item.before_image_url}
                                afterImage={item.after_image_url}
                                beforeThumbnail={item.before_thumbnail_url}
                                afterThumbnail={item.after_thumbnail_url}
                            />
                        ) : (
                            <img
                                src={getImageUrl(allImages[currentImageIndex])}
                                alt={item.title}
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>

                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h3>
                                {item.description && (
                                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                                )}
                            </div>
                            {item.has_before_after && (
                                <Button
                                    variant={showBeforeAfter ? 'default' : 'outline'}
                                    onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                                >
                                    {showBeforeAfter ? 'default' : 'outline'}
                                </Button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {item.category && (
                                <Badge variant="bg-blue-600">
                                    {item.category.name}
                                </Badge>
                            )}
                            {item.service && (
                                <Badge variant="secondary">
                                    {item.service.name}
                                </Badge>
                            )}
                            {item.upload_date && (
                                <Badge variant="outline">
                                    {new Date(item.upload_date).toLocaleDateString()}
                                </Badge>
                            )}
                        </div>

                        {/* Image counter */}
                        {allImages.length > 1 && !showBeforeAfter && (
                            <div className="text-center text-sm text-gray-500">
                                Image {currentImageIndex + 1} of {allImages.length}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ImageLightbox;