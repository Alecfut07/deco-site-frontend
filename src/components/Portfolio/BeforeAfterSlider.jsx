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
  const beforeImgRef = useRef(null);
  const afterImgRef = useRef(null);
  const [imageAspectRatio, setImageAspectRatio] = useState(null);
  const [containerClass, setContainerClass] = useState("aspect-video");

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

  // Keyboard controls for the divider handle, scoped to its own focus
  // (not a page-wide listener) per the WAI-ARIA slider pattern.
  const handleHandleKeyDown = useCallback((e) => {
    const step = e.shiftKey ? 5 : 1;
    if (e.key === "ArrowLeft") {
      setPosition((prev) => [Math.max(0, prev[0] - step)]);
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      setPosition((prev) => [Math.min(100, prev[0] + step)]);
      e.preventDefault();
    } else if (e.key === "Home") {
      setPosition([0]);
      e.preventDefault();
    } else if (e.key === "End") {
      setPosition([100]);
      e.preventDefault();
    }
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

  // Dectect image orientation and adjust container
  useEffect(() => {
    const detectImageOrientation = () => {
      if (!beforeImgRef.current || !afterImgRef.current) return;

      const beforeImg = beforeImgRef.current;
      const afterImg = afterImgRef.current;

      // Wait for both images to load
      if (!beforeImg.complete || !afterImg.complete) {
        const handleLoad = () => {
          if (beforeImg.complete && afterImg.complete) {
            calculateAspectRatio();
          }
        };
        beforeImg.addEventListener("load", handleLoad);
        afterImg.addEventListener("load", handleLoad);
        return () => {
          beforeImg.removeEventListener("load", handleLoad);
          afterImg.removeEventListener("load", handleLoad);
        };
      }

      calculateAspectRatio();
    };

    const calculateAspectRatio = () => {
      const beforeImg = beforeImgRef.current;
      const afterImg = afterImgRef.current;

      if (!beforeImg || !afterImg) return;

      // Get natural dimensions
      const beforeWidth = beforeImg.naturalWidth || beforeImg.width;
      const beforeHeight = beforeImg.naturalHeight || beforeImg.height;
      const afterWidth = afterImg.naturalWidth || afterImg.width;
      const afterHeight = afterImg.naturalHeight || afterImg.height;

      // Calculate aspect ratios
      const beforeRatio = beforeWidth / beforeHeight;
      const afterRatio = afterWidth / afterHeight;

      // Use average or the first image's ratio
      const avgRatio = (beforeRatio + afterRatio) / 2;
      const isPortrait = avgRatio < 1;

      setImageAspectRatio(avgRatio);

      // Set container class based on orientation
      if (isPortrait) {
        // Portrait: use aspect-[3/4] or calculate from ratio
        setContainerClass("aspect-[3/4]");
      } else {
        // Landscape: use aspect-video (16:9) or wider
        if (avgRatio > 1.5) {
          setContainerClass("aspect-[21/9]"); // Ultra-wide
        } else {
          setContainerClass("aspect-video"); // Standard 16:9
        }
      }
    };

    detectImageOrientation();
  }, [beforeImage, afterImage]);

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
        className={`relative w-full overflow-hidden rounded-lg bg-muted cursor-ew-resize select-none ${
          containerClass || "aspect-video"
        }`}
        style={{
          aspectRatio: imageAspectRatio ? `${imageAspectRatio}` : "16/9",
          maxHeight: "70vh",
          maxWidth: "100%",
        }}
        onClick={handleImageClick}
        role="button"
        tabIndex={0}
        aria-label="Before and after comparison slider"
      >
        {/* After Image (Bottom Layer) */}
        <img
          ref={afterImgRef}
          src={afterImage}
          alt="After"
          className="absolute inset-0 h-full w-full object-contain pointer-events-none"
          draggable={false}
          onLoad={() => {
            // Trigger recalculation when image loads
            if (
              beforeImgRef.current?.complete &&
              afterImgRef.current?.complete
            ) {
              const beforeImg = beforeImgRef.current;
              const afterImg = afterImgRef.current;
              const beforeRatio =
                (beforeImg.naturalWidth || beforeImg.width) /
                (beforeImg.naturalHeight || beforeImg.height);
              const afterRatio =
                (afterImg.naturalWidth || afterImg.width) /
                (afterImg.naturalHeight || afterImg.height);
              const avgRatio = (beforeRatio + afterRatio) / 2;
              const isPortrait = avgRatio < 1;

              if (isPortrait) {
                setContainerClass("aspect-[3/4]");
              } else {
                if (avgRatio > 1.5) {
                  setContainerClass("aspect-[21/9]");
                } else {
                  setContainerClass("aspect-video");
                }
              }
            }
          }}
        />

        {/* Before Image (Top Layer with Clip) */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden transition-all duration-100"
          style={{ clipPath: `inset(0 ${position[0]}% 0 0)` }}
        >
          <img
            ref={beforeImgRef}
            src={beforeImage}
            alt="Before"
            className="absolute inset-0 h-full w-full object-contain pointer-events-none"
            draggable={false}
            onLoad={() => {
              // Trigger recalculation when image loads
              if (
                beforeImgRef.current?.complete &&
                afterImgRef.current?.complete
              ) {
                const beforeImg = beforeImgRef.current;
                const afterImg = afterImgRef.current;
                const beforeRatio =
                  (beforeImg.naturalWidth || beforeImg.width) /
                  (beforeImg.naturalHeight || beforeImg.height);
                const afterRatio =
                  (afterImg.naturalWidth || afterImg.width) /
                  (afterImg.naturalHeight || afterImg.height);
                const avgRatio = (beforeRatio + afterRatio) / 2;
                const isPortrait = avgRatio < 1;

                if (isPortrait) {
                  setContainerClass("aspect-[3/4]");
                } else {
                  if (avgRatio > 1.5) {
                    setContainerClass("aspect-[21/9]");
                  } else {
                    setContainerClass("aspect-video");
                  }
                }
              }
            }}
          />
        </div>

        {/* Divider Line with Handle */}
        <div
          ref={sliderRef}
          className={`absolute top-0 bottom-0 w-1 cursor-ew-resize bg-white shadow-2xl z-20 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            isDragging ? "scale-110" : "scale-100"
          }`}
          style={{ left: `${position[0]}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onKeyDown={handleHandleKeyDown}
          role="slider"
          tabIndex={0}
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
