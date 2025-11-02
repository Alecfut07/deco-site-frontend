import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PortfolioGrid from './PortfolioGrid';
import PortfolioModal from './PortfolioModal';
import { usePortfolioItems, useCategories, useServices, useSearchAndFilter } from '../../services/api';

const PortfolioGallery = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [service, setService] = useState('All Services');
    const [page, setPage] = useState(1);
    const pageSize = 12;

    // Fetch data
    const { data: categories = [] } = useCategories();
    const { data: services = [] } = useServices();

    // Determine which query to use
    const hasFilters = searchQuery || category !== 'All' || service !== 'All Services';

    const {
        data: filteredData,
        isLoading: filteredLoading,
        error: filteredError
    } = useSearchAndFilter(searchQuery, category, page, pageSize);

    const {
        data: regularData,
        isLoading: regularLoading,
        error: regularError
    } = usePortfolioItems(page, pageSize);

    // Use filtered or regular data
    const portfolioData = hasFilters ? filteredData : regularData;
    const isLoading = hasFilters ? filteredLoading : regularLoading;
    const error = hasFilters ? filteredError : regularError;

    const items = portfolioData?.portfolio_items || [];
    const pagination = portfolioData?.pagination || {};

    const categoryOptions = ['All', ...categories.map(c => c.name)];
    const serviceOptions = ['All Services', ...services.filter(s => s.is_active).map(s => s.name)];

    const handleClearFilters = () => {
        setSearchQuery('');
        setCategory('All');
        setService('All Services');
        setPage(1);
    };

    if (isLoading) {
        return (
            <section id="portfolio" className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="mt-4 text-muted-foreground">Loading portfolio...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="portfolio" className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <p className="text-destructive">Error loading portfolio. Please try again.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="portfolio" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Our Work
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Explore our portfolio of stunning transformations
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 space-y-4 animate-fade-in-up">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input 
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryOptions.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={service} onValueChange={setService}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Service" />
                            </SelectTrigger>
                            <SelectContent>
                                {serviceOptions.map(svc => (
                                    <SelectItem key={svc} value={svc}>{svc}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {(searchQuery || category !== 'All' || service !== 'All Services') && (
                            <Button variant="outline" onClick={handleClearFilters}>
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>

                {/* Gallery Grid */}
                {items.length > 0 ? (
                    <PortfolioGrid items={items} onItemClick={setSelectedItem} />
                ) : (
                    <div className="text-center py-16">
                        <p className="text-xl text-muted-foreground mb-4">No projects found</p>
                        <Button onClick={handleClearFilters}>Clear Filters</Button>
                    </div>
                )}

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={!pagination.has_previous}
                        >
                            Previous
                        </Button>
                        <span className="flex items-center px-4">Page {pagination.page} of {pagination.total_pages}</span>
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => p + 1)}
                            disabled={!pagination.has_next}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedItem && (
                <PortfolioModal 
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </section>
    );
};

export default PortfolioGallery;