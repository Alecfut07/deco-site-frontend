import { motion, AnimatePresence } from 'motion';
import { X } from 'lucide-react';

const ImageLightbox = ({ item, onClose }) => {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="relative max-w-4xl max-h-full bg-white rounded-xl overflow-hidden"
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

                    <div className="max-h-[70vh] overflow-hidden">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h3>
                        {item.description && (
                            <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {item.category && (
                                <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm">
                                    {item.category.name}
                                </span>
                            )}
                            {item.service && (
                                <span className="bg-secondary-500 text-white px-3 py-1 rounded-full text-sm">
                                    {item.service.name}
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ImageLightbox;