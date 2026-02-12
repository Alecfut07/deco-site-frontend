import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video } from "lucide-react";
import { motion } from "motion/react";

const getCoverImage = (item) => {
  // Priority: thumbnail_url > gallery_image_url > image_url
  // Then check first gallery image thumbnail
  // Then check first video thumbnail
  if (item?.thumbnail_url) return item.thumbnail_url;
  if (item?.gallery_image_url) return item.gallery_image_url;
  if (item?.image_url) return item.image_url;

  // Check first gallery image
  if (item?.pictures && item.pictures.length > 0) {
    const firstPicture = item.pictures[0];
    return (
      firstPicture?.thumbnail_url ||
      firstPicture?.image_url ||
      firstPicture?.gallery_image_url
    );
  }

  // Check first video thumbnail
  if (item?.videos && item.videos.length > 0) {
    const firstVideo = item.videos[0];
    return firstVideo?.thumbnail_url;
  }

  return null;
};

const PortfolioGrid = ({ items = [], onItemClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item, index) => {
        const coverImage = getCoverImage(item);
        const hasOnlyVideos =
          !coverImage && item?.videos && item.videos.length > 0;
        const categoryLabel =
          item?.category?.name ?? item?.category ?? "Uncategorized";
        const imageCount = item?.image_count ?? item?.pictures?.length ?? 0;
        const videoCount = item?.videos?.length ?? 0;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="h-full"
          >
            <Card
              className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl h-full"
              onClick={() => onItemClick?.(item)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onItemClick?.(item);
                }
              }}
            >
              <div className="relative aspect-square overflow-hidden">
                {coverImage ? (
                  <>
                    <img
                      src={coverImage}
                      alt={item.title}
                      className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-110 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      loading="lazy"
                      onLoad={() => setImageLoaded(true)}
                    />
                    {!imageLoaded && (
                      <div className="absolute inset-0 animate-pulse bg-muted" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-foreground shadow-lg">
                        View project
                      </span>
                    </div>
                  </>
                ) : hasOnlyVideos ? (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground relative">
                    <Video className="w-16 h-16 opacity-50" />
                    {videoCount > 0 && (
                      <Badge
                        className="absolute bottom-2 right-2"
                        variant="secondary"
                      >
                        {videoCount} video{videoCount > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                    No media
                  </div>
                )}

                {item?.has_before_after && (
                  <Badge className="absolute right-2 top-2 bg-accent text-xs uppercase tracking-wide">
                    Before / After
                  </Badge>
                )}

                {imageCount > 1 && (
                  <Badge
                    variant="secondary"
                    className="absolute left-2 top-2 text-xs"
                  >
                    {imageCount} photos
                  </Badge>
                )}
              </div>

              <CardContent className="p-5">
                <h3 className="mb-1 line-clamp-1 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {categoryLabel}
                  </Badge>
                  {item?.service && (
                    <Badge variant="outline" className="text-xs">
                      {item?.service?.name ?? item.service}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PortfolioGrid;
