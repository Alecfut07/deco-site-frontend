import { useState } from 'react';
import { Slider } from '@/components/ui/slider';

const BeforeAfterSlider =({ beforeImage, afterImage }) => {
    const [position, setPosition] = useState([50]);

    return (
        <div className="space-y-4">
            {/* Main Slider */}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                {/* After Image (Bottom Layer) */}
                <img
                    src={afterImage}
                    alt="After"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Before Image (Top Layer with Clip) */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - position[0]}% 0 0)` }}
                >
                    <img
                        src={beforeImage}
                        alt="Before"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>

                <div
                    className="absolute top-0 bottom-0 w-1 cursor-ew-resize bg-white shadow-lg z-10"
                    style={{ left: `${position[0]}%` }}
                >
                    <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
                        <div className="h-4 w-1 rounded bg-primary" />
                    </div>
                </div>

                <div className="absolute left-4 top-4 rounded bg-black/70 px-3 py-1 text-sm font-medium text-white z-10">
                    Before
                </div>
                <div className="absolute right-4 top-4 rounded bg-black/70 px-3 py-1 text-sm font-medium text-white z-10">
                    After
                </div>
            </div>

            <div className="px-4">
                <Slider
                    value={position}
                    onValueChange={setPosition}
                    max={100}
                    step={1}
                    aria-label="Adjust before and after comparison"
                />
            </div>
        </div>
    );
};

export default BeforeAfterSlider;