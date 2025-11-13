import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Image as ImageIcon } from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';


const normalizeMedia = (collection = []) =>
    [...collection].sort((a, b) => (a?.display_order ?? 0) - (b?.display_order ?? 0));

const PortfolioModal = ({ item, onClose }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [playingVideo, setPlayingVideo] = useState(null);

    const pictures = useMemo(() => normalizeMedia(item?.pictures), [item?.pictures]);
    const videos = useMemo(() => normalizeMedia(item?.videos), [item?.videos]);

    const handleVideoToggle = (videoId) => {
        setPlayingVideo((current) => (current === videoId ? null : videoId));
    };
    
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-foreground">
                        {item.title}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                    {/* Before/After Slider or Gallery Image */}
                    {item?.has_before_after && item?.before_image_url && item?.after_image_url && (
                        <BeforeAfterSlider 
                            beforeImage={item.before_image_url}
                            afterImage={item.after_image_url}
                            beforeThumbnail={item.before_thumbnail_url}
                            afterThumbnail={item.after_thumbnail_url}
                        />
                    )}
                    
                    {/* Description */}
                    <div>
                        {item?.description && (
                            <p className="mb-4 text-base leading-relaxed text-foreground">{item.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {item?.category && (
                                <Badge variant="secondary">
                                    {item.category?.name ?? item.category}
                                </Badge>
                            )}
                            {item?.service && (
                                <Badge variant="outline">
                                    {item.service?.name ?? item.service}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <Tabs defaultValue="pictures" className="w-full">
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
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                    {pictures.map((picture) => (
                                        <button
                                            type="button"
                                            key={picture.id ?? picture.image_url}
                                            className="group relative overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            onClick={() => setSelectedImage(picture.gallery_image_url ?? picture.image_url)}
                                        >
                                            <img 
                                                src={picture.thumbnail_url ?? picture.gallery_image_url ?? picture.image_url}
                                                alt={picture.caption || `${item.title} detail`}
                                                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            {picture.caption && (
                                                <div className="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2 text-sm text-white">
                                                    {picture.caption}
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 py-12 text-muted-foreground">
                                    <ImageIcon className="mb-3 h-12 w-12 opacity-50" aria-hidden="true" />
                                    <p>No additional pictures available for this project.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="videos" className="space-y-4">
                            {videos.length ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {videos.map((video) => {
                                        const isPlaying = playingVideo === (video.id ?? video.video_url);

                                        return (
                                            <div key={video.id ?? video.video_url} className="space-y-2">
                                                {isPlaying ? (
                                                    <video
                                                        src={video.video_url}
                                                        className="w-full rounded-lg"
                                                        controls
                                                        autoPlay
                                                        onEnded={() => setPlayingVideo(null)}
                                                    >
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="group relative block overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                        onClick={() => handleVideoToggle(video.id ?? video.video_url)}
                                                    >
                                                        <img 
                                                            src={video.thumbnail_url}
                                                            alt={video.caption || `${item.title} video`}
                                                            className="h-48 w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
                                                            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg">
                                                                <Play className="ml-1 h-8 w-8" aria-hidden="true" />
                                                            </span>
                                                        </div>
                                                    </button>
                                                )}
                                                {video.caption && (
                                                    <p className="text-sm text-muted-foreground">{video.caption}</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 py-12 text-muted-foreground">
                                    <Play className="mb-3 h-12 w-12 opacity-50" aria-hidden="true" />
                                    <p>No videos available for this project.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                {selectedImage && (
                    <Dialog open onOpenChange={(open) => setSelectedImage(null)}>
                        <DialogContent className="max-w-6xl p-0">
                            <img 
                                src={selectedImage}
                                alt="Full size project view"
                                className="h-auto w-full rounded-md object-contain"
                            />
                        </DialogContent>
                    </Dialog>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PortfolioModal;