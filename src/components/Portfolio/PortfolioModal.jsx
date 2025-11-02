import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import BeforeAfterSlider from './BeforeAfterSlider';
import { getImageUrl } from '../../services/api';

const PortfolioModal = ({ item, onClose }) => {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{item.title}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                    {/* Before/After Slider or Gallery Image */}
                    {item.has_before_after && item.before_image_url && item.after_image_url ? (
                        <BeforeAfterSlider 
                            beforeImage={item.before_image_url}
                            afterImage={item.after_image_url}
                        />
                    ) : (
                        <div className="rounded-lg overflow-hidden">
                            <img 
                                src={getImageUrl(item.gallery_image_url)}
                                alt={item.title}
                                className="w-full h-auto"
                            />
                        </div>
                    )}
                    
                    {/* Description */}
                    <div>
                        <p className="text-foreground mb-4">{item.description}</p>
                        <div className="flex gap-2 flex-wrap">
                            {item.category && <Badge variant="secondary">{item.category.name}</Badge>}
                            {item.service && <Badge variant="outline">{item.service.name}</Badge>}
                        </div>
                    </div>

                    {/* Additional Images */}
                    {item.images && item.images.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">More Images</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {item.images.map((img, idx) => (
                                    <div key={idx} className="rounded-lg overflow-hidden">
                                        <img 
                                            src={getImageUrl(img)}
                                            alt={`${item.title} ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PortfolioModal;