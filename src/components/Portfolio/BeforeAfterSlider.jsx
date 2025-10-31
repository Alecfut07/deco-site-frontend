import { useState } from 'react';
import { motion } from 'motion/react';
import { getImageUrl } from '../services/api';

const BeforeAfterSlider = ({ beforeImage, afterImage, beforeThumbnail, afterThumbnail }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const handleMove = (e) => {
        if (!isDragging) return;

        const rect = e.currentTarget.getBoundingClientReact();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPosition(percent);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;

        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPosition(percent);
    };

    return (
        <div
            className="relative w-full aspect-video overflow-hidden select-none cursor-ew-resize"
            onMouseMove={handleMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
        >
            {/* After Image (Background) */}
            <div className="absolute inset-0">
                <img 
                    src={getImageUrl(afterImage)}
                    alt="After"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    After
                </div>
            </div>

            {/* Before Image (Foreground with clip) */}
            <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={getImageUrl(beforeImage)}
                    alt="Before"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    Before
                </div>
            </div>

            {/* Slider Line */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default BeforeAfterSlider;