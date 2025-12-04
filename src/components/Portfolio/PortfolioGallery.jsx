import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PortfolioGrid from "./PortfolioGrid";
import PortfolioModal from "./PortfolioModal";
import {
  usePortfolioItems,
  useCategories,
  useServices,
  useSearchAndFilter,
} from "../../services/api";

const PAGE_SIZE = 12;

const mapCollectionToOptions = (collection = [], allLabel) => {
  // Handle both array and paginated response formats
  const items = Array.isArray(collection)
    ? collection
    : collection?.results || [];

  return [{ label: allLabel, value: "all" }].concat(
    items.map((entry, index) => {
      const label = entry?.name ?? entry?.title ?? "Unnamed";
      const slug = entry?.slug?.trim();
      const id = entry?.id != null ? String(entry.id) : `index-${index}`;
      // ensure every option has a non-empty value
      const value = slug || id;

      return { label, value };
    })
  );
};

const extractItems = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.portfolio_items)) return payload.portfolio_items;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
};

const getPaginationMeta = (payload, currentPage, pageSize) => {
  if (!payload) {
    return {
      page: currentPage,
      page_size: pageSize,
      has_next: false,
      has_previous: currentPage > 1,
      total_pages: 1,
      count: 0,
    };
  }

  if (payload.pagination) return payload.pagination;

  const count = payload.count ?? extractItems(payload).length;
  const totalPages = count ? Math.max(1, Math.ceil(count / pageSize)) : 1;

  return {
    page: payload.page ?? currentPage,
    page_size: payload.page_size ?? pageSize,
    has_next: payload.has_next ?? (payload.page ?? currentPage) < totalPages,
    has_previous: payload.has_previous ?? (payload.page ?? currentPage) > 1,
    total_pages: totalPages,
    count,
  };
};

const PortfolioGallery = () => {
  const [searchInput, setSearchInput] = useState(""); // Input value (updates immediately)
  const [searchQuery, setSearchQuery] = useState(""); // Actual search query (debounced)
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch data
  const { data: categoriesData = [] } = useCategories();
  const { data: servicesData = [] } = useServices();

  const categoryOptions = useMemo(
    () => mapCollectionToOptions(categoriesData, "All Categories"),
    [categoriesData]
  );
  const serviceOptions = useMemo(
    () => mapCollectionToOptions(servicesData, "All Services"),
    [servicesData]
  );

  // Debounce search input - only update searchQuery after user stops typing for 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setPage(1); // Reset to page 1 when search changes
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Determine which query to use
  const hasFilters = Boolean(searchQuery || category || service);

  const {
    data: filteredData,
    isLoading: filteredLoading,
    isFetching: filteredFetching,
    error: filteredError,
  } = useSearchAndFilter(searchQuery, category, service, page, PAGE_SIZE);

  const {
    data: baseData,
    isLoading: baseLoading,
    isFetching: baseFetching,
    error: baseError,
  } = usePortfolioItems(page, PAGE_SIZE, { enabled: !hasFilters });

  const activeData = hasFilters ? filteredData : baseData;
  const isLoading = hasFilters ? filteredLoading : baseLoading;
  const isFetching = hasFilters ? filteredFetching : baseFetching;
  const error = hasFilters ? filteredError : baseError;

  const items = useMemo(() => extractItems(activeData), [activeData]);
  const pagination = useMemo(
    () => getPaginationMeta(activeData, page, PAGE_SIZE),
    [activeData, page]
  );

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setCategory("");
    setService("");
    setPage(1);
  };

  const handlePageChange = (direction) => {
    setPage((prev) => {
      if (direction === "next" && pagination.has_next) return prev + 1;
      if (direction === "prev" && pagination.has_previous)
        return Math.max(1, prev - 1);
      return prev;
    });
  };

  if (error) {
    return (
      <section id="portfolio" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-6 py-8 text-center">
            <p className="text-lg font-semibold text-destructive">
              We couldn't load the portfolio right now.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please try again in a moment or refresh the page.
            </p>
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
            Explore transformations across interiors, exteriors, and specialty
            finishes.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 animate-fade-in-up">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder="Search projects..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="pl-10"
                aria-label="Search portfolio items"
              />
            </div>

            <Select
              value={category || "all-categories"}
              onValueChange={(value) => {
                setCategory(value === "all-categories" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger
                className="w-full md:w-48"
                aria-label="Filter by category"
              >
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={service || "all-services"}
              onValueChange={(value) => {
                setService(value === "all-services" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger
                className="w-full md:w-48"
                aria-label="Filter by service"
              >
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-services">All Services</SelectItem>
                {serviceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchInput || category || service) && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="relative">
          {isLoading && !items.length ? (
            // Initial load - show full loading spinner
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-9 w-9 border-b-2 border-primary" />
              <p className="mt-4 text-muted-foreground">Loading portfolio...</p>
            </div>
          ) : items.length ? (
            // Show grid with loading overlay if fetching new data
            <div className="relative">
              <PortfolioGrid items={items} onItemClick={setSelectedItem} />
              {isFetching && (
                <div
                  className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/70 backdrop-blur-sm"
                  aria-live="polite"
                  aria-label="Loading updated results"
                >
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                No projects found with the current filters.
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => handlePageChange("prev")}
              disabled={!pagination.has_previous}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.total_pages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange("next")}
              disabled={!pagination.has_next}
              aria-label="Next page"
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
