import { useState, useEffect, useMemo, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PortfolioGallerySkeleton } from "@/components/SkeletonSection";
import { motion } from "motion/react";
import PortfolioGrid from "./PortfolioGrid";
import PortfolioModal from "./PortfolioModal";
import { extractItems, getPaginationMeta } from "@/utils/portfolio";
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
    }),
  );
};

const mapCollectionToFilterOptions = (collection = [], allLabel) => {
  const items = Array.isArray(collection)
    ? collection
    : collection?.results || [];

  return [{ label: allLabel, value: "" }].concat(
    items
      .map((entry) => {
        const label = entry?.name ?? entry?.title ?? "Unnamed";
        const value = label.trim();
        return value ? { label, value } : null;
      })
      .filter(Boolean),
  );
};

const getOptionLabel = (options, value) =>
  options.find((o) => o.value === value)?.label ?? value;

const PortfolioGallery = () => {
  const [searchInput, setSearchInput] = useState(""); // Input value (updates immediately)
  const [searchQuery, setSearchQuery] = useState(""); // Actual search query (debounced)
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const gridTopRef = useRef(null);

  // Fetch data
  const { data: categoriesData = [] } = useCategories();
  const { data: servicesData = [] } = useServices();

  const categoryOptions = useMemo(
    () => mapCollectionToFilterOptions(categoriesData, "All Categories"),
    [categoriesData],
  );
  const serviceOptions = useMemo(
    () => mapCollectionToFilterOptions(servicesData, "All Services"),
    [servicesData],
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
    refetch: refetchFiltered,
  } = useSearchAndFilter(searchQuery, category, service, page, PAGE_SIZE);

  const {
    data: baseData,
    isLoading: baseLoading,
    isFetching: baseFetching,
    error: baseError,
    refetch: refetchBase,
  } = usePortfolioItems(page, PAGE_SIZE, { enabled: !hasFilters });

  const activeData = hasFilters ? filteredData : baseData;
  const isLoading = hasFilters ? filteredLoading : baseLoading;
  const isFetching = hasFilters ? filteredFetching : baseFetching;
  const error = hasFilters ? filteredError : baseError;

  const items = useMemo(() => extractItems(activeData), [activeData]);
  const pagination = useMemo(
    () => getPaginationMeta(activeData, page, PAGE_SIZE),
    [activeData, page],
  );

  const resultRange = useMemo(() => {
    const total = pagination.count ?? 0;
    if (total === 0) return { start: 0, end: 0, total: 0 };
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, total);
    return { start, end, total };
  }, [page, pagination.count]);

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setCategory("");
    setService("");
    setPage(1);
  };

  const handlePageChange = (direction) => {
    setPage((prev) => {
      const next =
        direction === "next" && pagination.has_next
          ? prev + 1
          : direction === "prev" && pagination.has_previous
            ? Math.max(1, prev - 1)
            : prev;
      return next;
    });
    setTimeout(() => {
      gridTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const handleRetry = () => {
    if (hasFilters) refetchFiltered();
    else refetchBase();
  };

  if (error) {
    return (
      <section id="portfolio" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-6 py-8 text-center">
            <p className="text-lg font-semibold text-destructive">
              We couldn&apos;t load the portfolio right now.
            </p>
            <p className="mt-2 text-sm text-muted-foreground mb-6">
              Please try again in a moment or refresh the page.
            </p>
            <Button variant="outline" onClick={handleRetry}>
              Try again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            My Work
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore my portfolio of completed projects.
          </p>
        </motion.div>

        {/* Filters */}
        <a
          href="#portfolio-results"
          className="sr-only focus:fixed focus:left-4 focus:top-20 focus:z-[100] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none"
        >
          Skip to portfolio results
        </a>
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
                setCategory(
                  value === "all-categories" || value === "" ? "" : value,
                );
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
                {categoryOptions
                  .filter((o) => o.value !== "")
                  .map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select
              value={service || "all-services"}
              onValueChange={(value) => {
                setService(
                  value === "all-services" || value === "" ? "" : value,
                );
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
                {serviceOptions
                  .filter((o) => o.value !== "")
                  .map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <div className="flex flex-wrap items-center gap-2">
              {searchInput && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm">
                  Search: &quot;{searchInput}&quot;
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      setSearchQuery("");
                      setPage(1);
                    }}
                    className="rounded-full p-0.5 hover:bg-primary/20"
                    aria-label={`Remove search filter "${searchInput}"`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {category && category !== "all-categories" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm">
                  {getOptionLabel(categoryOptions, category)}
                  <button
                    type="button"
                    onClick={() => {
                      setCategory("");
                      setPage(1);
                    }}
                    className="rounded-full p-0.5 hover:bg-primary/20"
                    aria-label={`Remove category filter`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {service && service !== "all-services" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm">
                  {getOptionLabel(serviceOptions, service)}
                  <button
                    type="button"
                    onClick={() => {
                      setService("");
                      setPage(1);
                    }}
                    className="rounded-full p-0.5 hover:bg-primary/20"
                    aria-label={`Remove service filter`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}

              {(searchInput || category || service) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-8 text-muted-foreground"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Result count */}
        {!isLoading && items.length > 0 && (
          <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
            Showing {resultRange.start}-{resultRange.end} of {resultRange.total}{" "}
            project{resultRange.total !== 1 ? "s" : ""}
          </p>
        )}

        {/* Gallery Grid */}
        <div
          id="portfolio-results"
          ref={gridTopRef}
          className="relative scroll-mt-24"
        >
          {isLoading && !items.length ? (
            <PortfolioGallerySkeleton />
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
            <motion.div
              className="flex flex-col items-center justify-center py-20 px-6 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4 flex h-16 items-center justify-center rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-muted-foreground">
                No projects found
              </p>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
                {searchInput || category || service
                  ? "Try adjusting your search or filters to see more results."
                  : "There are no portfolio items yet. Check back later."}
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                {searchInput || category || service
                  ? "Clear filters"
                  : "Refresh"}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {(pagination.total_pages > 1 || items.length > 0) && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-sm text-muted-foreground order-2 sm:order-1">
              {pagination.count > 0 && items.length > 0
                ? `Showing ${resultRange.start}-${resultRange.end} of ${resultRange.total}`
                : items.length > 0
                  ? `Showing ${resultRange.start}-${resultRange.end} of ${resultRange.total}`
                  : "No results"}
            </p>
            {pagination.total_pages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage(1);
                    setTimeout(
                      () =>
                        gridTopRef.current?.scrollIntoView?.({
                          behavior: "smooth",
                          block: "start",
                        }),
                      0,
                    );
                  }}
                  disabled={!pagination.has_previous || pagination.page === 1}
                  aria-label="First page"
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange("prev")}
                  disabled={!pagination.has_previous}
                  aria-label="Previous page"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground min-w-[100px] text-center">
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
                <Button
                  variant="outline"
                  onClick={() => {
                    setPage(pagination.total_pages);
                    setTimeout(
                      () =>
                        gridTopRef.current?.scrollIntoView?.({
                          behavior: "smooth",
                          block: "start",
                        }),
                      0,
                    );
                  }}
                  disabled={
                    !pagination.has_next ||
                    pagination.page === pagination.total_pages
                  }
                  aria-label="Last page"
                >
                  Last
                </Button>
              </div>
            )}
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
