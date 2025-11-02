import { useState } from 'react';
import { Slider } from '@/components/ui/slider';

const BeforeAfterSlider =({ beforeImage, afterImage }) => {
    const [sliderPosition, setSliderPosition] = useState([50]);

    return (
        <div className="space-y-4">
            {/* Main Slider */}
            <div className="relative w-full aspcet-video overflow-hidden rounded-lg bg-muted">
                {/* After Image (Bottom Layer) */}
                <img 
                    src={afterImage}
                    alt="After"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Before Image (Top Layer with Clip) */}
                <div
                    className="absolute inset-0 w-full h-full overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition[0]}% 0 0)`}}
                >
                    <img 
                        src={beforeImage}
                        alt="Before"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                    style={{ left: `${sliderPosition[0]}%`}}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-1 h-4 bg-primary rounded" />
                    </div>
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
                    Before
                </div>
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
                    After
                </div>
            </div>

            {/* Slider Control */}
            <div className="px-4">
                <Slider 
                    value={sliderPosition}
                    onValueChange={setSliderPosition}
                    max={100}
                    step={1}
                    className="cursor-pointer"
                />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-center">Before</p>
                    <img 
                        src={beforeImage}
                        alt="Before thumbnail"
                        className="w-full h-32 object-cover rounded-lg"
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium text-center">After</p>
                    <img 
                        src={afterImage}
                        alt="After thumbnail"
                        className="w-full h-32 object-cover rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default BeforeAfterSlider;