import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getImageUrl } from '../../services/api';

const PortfolioGrid = ({ items, onItemClick }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {items.map((item) => (
                <Card
                    key={item.id}
                    className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300"
                    onClick={() => onItemClick(item)}
                >
                    <div className="relative aspect-square overflow-hidden">
                        <img 
                            src={getImageUrl(item.thumbnail_url)}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-100 transition-transform duration-300"
                            loading="lazy"
                        />
                        {item.has_before_after && (
                            <Badge className="absolute top-2 right-2 bg-accent">
                                Before/After
                            </Badge>
                        )}
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                            {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {item.description}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                                {item.category?.name}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default PortfolioGrid;