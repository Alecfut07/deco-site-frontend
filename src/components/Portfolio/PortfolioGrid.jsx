import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in">
      {items.map((item) => {
        const coverImage = getCoverImage(item);
        const categoryLabel =
          item?.category?.name ?? item?.category ?? "Uncategorized";
        const imageCount = item?.image_count ?? item?.pictures?.length ?? 0;

        return (
          <Card
            key={item.id}
            className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl"
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
                <img
                  src={coverImage}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                  No image
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
        );
      })}
    </div>
  );
};

export default PortfolioGrid;
