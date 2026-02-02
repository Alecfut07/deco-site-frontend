import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { usePortfolioItem } from "@/services/api";

const normalizeMedia = (collection = []) =>
  [...collection].sort(
    (a, b) => (a?.display_order ?? 0) - (b?.display_order ?? 0)
  );

const PortfolioModal = ({ item, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("pictures");
  const [playingVideo, setPlayingVideo] = useState(null);
  const videoRef = useRef(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Fetch fresh data when modal opens to get latest videos/images
  const { data: freshItem, isLoading } = usePortfolioItem(item.id);

  // Use fresh data if available, otherwise fall back to passed item
  const currentItem = freshItem || item;

  const pictures = useMemo(
    () => normalizeMedia(currentItem?.pictures),
    [currentItem?.pictures]
  );
  const videos = useMemo(
    () => normalizeMedia(currentItem?.videos),
    [currentItem?.videos]
  );

  useEffect(() => {
    setCurrentVideoIndex(0);
    setPlayingVideo(null);
  }, [currentItem?.id]);

  // Get full image URL fo current index
  const getImageUrl = (picture) => {
    return (
      picture?.gallery_image_url ?? picture?.image_url ?? picture?.thumbnail_url
    );
  };

  // Navigation Pictures Handlers
  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : pictures.length - 1));
  }, [pictures.length]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev < pictures.length - 1 ? prev + 1 : 0));
  }, [pictures.length]);

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Navigation Videos Handlers
  const goToVideo = (index) => {
    setVideoError(false);
    setVideoLoading(true);
    setCurrentVideoIndex(index);
    setPlayingVideo(
      videos[index] ? videos[index].id ?? videos[index].video_url : null
    );
  };

  const goToPreviousVideo = useCallback(() => {
    setCurrentVideoIndex((prev) => {
      const next = prev > 0 ? prev - 1 : videos.length - 1;
      setPlayingVideo(
        videos[next] ? videos[next].id ?? videos[next].video_url : null
      );
      return next;
    });
  }, [videos]);

  const goToNextVideo = useCallback(() => {
    setCurrentVideoIndex((prev) => {
      const next = prev < videos.length - 1 ? prev + 1 : 0;
      setPlayingVideo(
        videos[next] ? videos[next].id ?? videos[next].video_url : null
      );
      return next;
    });
  }, [videos]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (activeTab === "videos" && videos.length > 0) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goToPreviousVideo();
          return;
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          goToNextVideo();
          return;
        }
      }
      if (activeTab === "pictures" && pictures.length > 0) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goToPrevious();
          return;
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          goToNext();
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    activeTab,
    goToPrevious,
    goToNext,
    goToPreviousVideo,
    goToNextVideo,
    pictures.length,
    videos.length,
    onClose,
  ]);

  const currentImage = pictures[currentImageIndex];

  // Show loading state while fetching fresh data
  if (isLoading && !item) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">
              Loading portfolio data...
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-foreground">
            {currentItem?.title || item?.title}
          </DialogTitle>
        </DialogHeader>

        {/* Description */}
        <div>
          {currentItem?.description && (
            <p className="mb-4 text-base leading-relaxed text-foreground">
              {currentItem.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {currentItem?.category && (
              <Badge variant="secondary">
                {currentItem.category?.name ?? currentItem.category}
              </Badge>
            )}
            {currentItem?.service && (
              <Badge variant="outline">
                {currentItem.service?.name ?? currentItem.service}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Before/After Slider */}
          {currentItem?.has_before_after &&
            currentItem?.before_image_url &&
            currentItem?.after_image_url && (
              <BeforeAfterSlider
                beforeImage={currentItem.before_image_url}
                afterImage={currentItem.after_image_url}
              />
            )}

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pictures">
                <ImageIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                Pictures ({pictures.length})
              </TabsTrigger>
              <TabsTrigger value="videos">
                <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                Videos ({videos.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pictures" className="space-y-4">
              {pictures.length ? (
                <div className="space-y-4">
                  {/* Main Image Viewer */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted group">
                    {currentImage && (
                      <>
                        <img
                          src={getImageUrl(currentImage)}
                          alt={
                            currentImage.caption ||
                            `${currentItem?.title || item?.title} - Image ${
                              currentImageIndex + 1
                            }`
                          }
                          className="h-full w-full object-contain transition-opacity duration-300"
                          loading="lazy"
                        />

                        {/* Navigation Arrows */}
                        {pictures.length > 1 && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={goToPrevious}
                              aria-label="Previous image"
                            >
                              <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={goToNext}
                              aria-label="Next image"
                            >
                              <ChevronRight className="h-6 w-6" />
                            </Button>
                          </>
                        )}

                        {/* Image Counter */}
                        {pictures.length > 1 && (
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/70 px-3 py-1 text-sm text-white">
                            {currentImageIndex + 1} / {pictures.length}
                          </div>
                        )}

                        {/* Caption */}
                        {currentImage.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
                            <p className="text-sm text-white">
                              {currentImage.caption}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Thumbnail Navigation Strip */}
                  {pictures.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {pictures.map((picture, index) => {
                        const thumbnailUrl =
                          picture?.thumbnail_url ??
                          picture?.gallery_image_url ??
                          picture?.image_url;
                        const isActive = index === currentImageIndex;

                        return (
                          <button
                            key={picture.id ?? picture.image_url ?? index}
                            type="button"
                            onClick={() => goToImage(index)}
                            className={`relative flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                              isActive
                                ? "border-primary ring-2 ring-primary ring-offset-2"
                                : "border-transparent hover:border-muted-foreground/50"
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                          >
                            <img
                              src={thumbnailUrl}
                              alt={picture.caption || `Thumbnail ${index + 1}`}
                              className="h-20 w-20 object-cover"
                              loading="lazy"
                            />
                            {isActive && (
                              <div className="absolute inset-0 bg-primary/20" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 py-12 text-muted-foreground">
                  <ImageIcon
                    className="mb-3 h-12 w-12 opacity-50"
                    aria-hidden="true"
                  />
                  <p>No additional pictures available for this project.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              {videos.length ? (
                <div className="space-y-4">
                  {/* Main Video Viewer */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted group">
                    {(() => {
                      const currentVideo = videos[currentVideoIndex];
                      if (!currentVideo) return null;
                      const videoId = currentVideo.id ?? currentVideo.video_url;
                      const isPlaying = playingVideo === videoId;
                      return (
                        <>
                          {isPlaying ? (
                            <video
                              ref={videoRef}
                              className="h-full w-full object-contain"
                              src={currentVideo.video_url}
                              controls
                              autoPlay
                              playsInline
                              onLoadedData={() => {
                                setVideoLoading(false);
                                setVideoError(false);
                              }}
                              onError={() => {
                                setVideoLoading(false);
                                setVideoError(true);
                              }}
                              onEnded={() => setPlayingVideo(null)}
                              aria-label={
                                currentVideo.caption ||
                                `Video ${currentVideoIndex + 1}`
                              }
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <button
                              type="button"
                              className="absolute inset-0 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
                              onClick={() => setPlayingVideo(videoId)}
                              aria-label={`Play video ${currentVideoIndex + 1}`}
                            >
                              {currentVideo.thumbnail_url ? (
                                <img
                                  src={currentVideo.thumbnail_url}
                                  alt={
                                    currentVideo.caption ||
                                    `Video ${currentVideoIndex + 1}`
                                  }
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                  <Play
                                    className="h-16 w-16 text-muted-foreground"
                                    aria-hidden="true"
                                  />
                                </div>
                              )}
                              <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-black/50 text-white">
                                <Play />
                              </span>
                            </button>
                          )}
                          {videoLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                              <div className="rounded-full border-2 border-white border-t-transparent h-8 w-8 animate-spin" />
                            </div>
                          )}
                          {videoError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-lg text-white px-4">
                              <p className="text-sm">
                                This video couldn't be loaded.
                              </p>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  setVideoError(false);
                                  setVideoLoading(true);
                                  if (videoRef.current) {
                                    videoRef.current.load();
                                  }
                                }}
                              >
                                Try Again
                              </Button>
                            </div>
                          )}
                          {videos.length > 1 && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={goToPreviousVideo}
                                aria-label="Previous video"
                              >
                                <ChevronLeft className="h-6 w-6" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={goToNextVideo}
                                aria-label="Next video"
                              >
                                <ChevronRight className="h-6 w-6" />
                              </Button>
                            </>
                          )}
                          {videos.length > 1 && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/70 px-3 py-1 text-sm text-white">
                              {currentVideoIndex + 1} / {videos.length}
                            </div>
                          )}
                          {currentVideo.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
                              <p className="text-sm text-white">
                                {currentVideo.caption}
                              </p>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Thumbnail strip */}
                  {videos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {videos.map((video, index) => {
                        const isActive = index === currentVideoIndex;
                        const thumbUrl = video.thumbnail_url;
                        return (
                          <button
                            key={video.id ?? video.video_url ?? index}
                            type="button"
                            onClick={() => goToVideo(index)}
                            className={`relative flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all aspect-video w-24 ${
                              isActive
                                ? "border-primary ring-2 ring-primary ring-offset-2"
                                : "border-transparent hover:border-muted-foreground/50"
                            }`}
                            aria-label={`Go to video ${index + 1}`}
                          >
                            {thumbUrl ? (
                              <img
                                src={thumbUrl}
                                alt={video.caption || `Video ${index + 1}`}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-muted">
                                <Play
                                  className="h-6 w-6 text-muted-foreground"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                            {isActive && (
                              <div className="absolute inset-0 bg-primary/20" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 py-12 text-muted-foreground">
                  <Play
                    className="mb-3 h-12 w-12 opacity-50"
                    aria-hidden="true"
                  />
                  <p>No videos available for this project.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioModal;
