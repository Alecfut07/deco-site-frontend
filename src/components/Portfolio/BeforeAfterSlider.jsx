import { useState, useRef, useEffect, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RotateCw, Maximize2, Minimize2 } from "lucide-react";

const BeforeAfterSlider = ({ beforeImage, afterImage }) => {
  const [position, setPosition] = useState([50]);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  // Update position from mouse/touch
  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition([percentage]);
  }, []);

  // Mouse drag handlers
  const handleMouseDown = useCallback(
    (e) => {
      if (e.button !== 0) return; // Only left click
      setIsDragging(true);
      updatePosition(e.clientX);
      e.preventDefault();
    },
    [updatePosition],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        updatePosition(e.clientX);
      }
    },
    [isDragging, updatePosition],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback(
    (e) => {
      setIsDragging(true);
      updatePosition(e.touches[0].clientX);
      e.preventDefault();
    },
    [updatePosition],
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (isDragging) {
        updatePosition(e.touches[0].clientX);
      }
    },
    [isDragging, updatePosition],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Click on image to set position
  const handleImageClick = useCallback(
    (e) => {
      if (isDragging) return; // Don't trigger if we just dragged
      if (
        e.target === sliderRef.current ||
        sliderRef.current?.contains(e.target)
      ) {
        return; // Don't trigger if clicking on slider
      }
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition],
  );

  // keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current) return;

      // Only handle if slider container is focused or visible
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const step = e.shiftKey ? 5 : 1; // Bigger steps with Shift
        setPosition((prev) => {
          const newPos =
            e.key === "ArrowLeft"
              ? Math.max(0, prev[0] - step)
              : Math.min(100, prev[0] + step);
          return [newPos];
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Global mouse/touch event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  // Reset to center
  const handleReset = () => {
    setPosition([50]);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen();
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span>
            Comparison: {Math.round(position[0])}% /{" "}
            {Math.round(100 - position[0])}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8"
            aria-label="Reset to center"
          >
            <RotateCw />
            Reset
          </Button>
          {document.fullscreenEnabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="h-8"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Main Slider */}
      <div
        ref={containerRef}
        className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted cursor-ew-resize select-none"
        onClick={handleImageClick}
        role="button"
        tabIndex={0}
        aria-label="Before and after comparison slider"
      >
        {/* After Image (Bottom Layer) */}
        <img
          src={afterImage}
          alt="After"
          className="absolute inset-0 h-full w-full object-contain pointer-events-none"
          draggable={false}
        />

        {/* Before Image (Top Layer with Clip) */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden transition-all duration-100"
          style={{ clipPath: `inset(0 ${100 - position[0]}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt="Before"
            className="absolute inset-0 h-full w-full object-contain pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Divider Line with Handle */}
        <div
          ref={sliderRef}
          className={`absolute top-0 bottom-0 w-1 cursor-ew-resize bg-white shadow-2xl z-20 transition-transform ${
            isDragging ? "scale-110" : "scale-100"
          }`}
          style={{ left: `${position[0]}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          role="slider"
          aria-valuenow={position[0]}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Adjust comparison position"
        >
          {/* Handle Circle */}
          <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl ring-2 ring-primary/20 transition-all hover:ring-primary/40">
            <div className="flex gap-1">
              <div className="h-6 w-1 rounded bg-primary" />
              <div className="h-6 w-1 rounded bg-primary" />
            </div>
          </div>

          {/* Arrows on handle */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 pointer-events-none">
            <div className="absolute left-0 flex h-1 w-2 items-center justify-center rounded bg-white/80 opacity-60">
              <div className="h-0 w-0 border-y-4 border-r-4 border-transparent border-r-white/80" />
            </div>
            <div className="absolute right-0 flex h-1 w-2 items-center justify-center rounded bg-white/80 opacity-60">
              <div className="h-0 w-0 border-y-4 border-l-4 border-transparent border-l-white/80" />
            </div>
          </div>
        </div>

        {/* Labels with conditional highlighting */}
        <div
          className={`absolute left-4 top-4 z-10 rounded-lg backdrop-blur-sm px-3 py-1.5 text-sm font-semibold shadow-lg transition-all ${
            position[0] === 0
              ? "bg-primary text-primary-foreground"
              : position[0] === 100
                ? "bg-black/40 text-white/50"
                : "bg-black/80 text-white"
          }`}
        >
          Before
        </div>
        <div
          className={`absolute right-4 top-4 z-10 rounded-lg backdrop-blur-sm px-3 py-1.5 text-sm font-semibold shadow-lg transition-all ${
            position[0] === 100
              ? "bg-primary text-primary-foreground"
              : position[0] === 0
                ? "bg-black/40 text-white/50"
                : "bg-black/80 text-white"
          }`}
        >
          After
        </div>
      </div>

      {/* Slider Control */}
      <div className="px-4">
        <Slider
          value={position}
          onValueChange={setPosition}
          max={100}
          step={0.5}
          className="w-full"
          aria-label="Adjust before and after comparison"
        />
      </div>

      {/* Instructions */}
      <p className="text-sm text-center text-muted-foreground">
        Drag the divider, click the image, use arrow keys, or use the slider
        below
      </p>
    </div>
  );
};

export default BeforeAfterSlider;
