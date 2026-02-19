import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { notify } from "@/utils/notify";
import {
  Plus,
  Pencil,
  Trash2,
  Images,
  Video,
  Search,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { SkeletonGrid } from "@/components/admin/SkeletonCard";
import { EmptyState } from "@/components/admin/EmptyState";
import { Pagination } from "@/components/admin/Pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PAGE_SIZE = 20;

const PortfolioItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const loadItems = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (search) params.set("search", search);

      const data = await api.getPortfolioItems(params);
      setItems(data.results || []);
      setTotalCount(data.count || 0);
      setHasNext(!!data.next);
      setHasPrevious(!!data.previous);
      setCurrentPage(page);
    } catch (error) {
      notify({
        title: "Error",
        description: "Failed to load portfolio items.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadItems(1);
    }, 400);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await api.deletePortfolioItem(deleteId);
      notify({ title: "Success", description: "Portfolio item deleted." });
      loadItems(currentPage);
    } catch (error) {
      notify({
        title: "Error",
        description: error?.data?.detail || "Failed to delete item.",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Portfolio Items</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/admin/portfolio/new">
            <Plus className="w-4 h-4 mr-2" />
            New Item
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          <SkeletonGrid count={6} variant="portfolio" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title={search ? "No portfolio items found" : "No portfolio items yet"}
          description={
            search
              ? "Try adjusting your search terms"
              : "Create your first portfolio item to showcase your work"
          }
          actionLabel={!search ? "Create Portfolio Item" : undefined}
          onAction={
            !search
              ? () => (window.location.href = "/admin/portfolio/new")
              : undefined
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {items.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden group transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative">
                  {item.thumbnail_url ||
                  item.gallery_image_url ||
                  item.image_url ? (
                    <img
                      src={
                        item.thumbnail_url ||
                        item.gallery_image_url ||
                        item.image_url
                      }
                      alt={item.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : item.videos && item.videos.length > 0 ? (
                    <div className="w-full h-48 bg-muted flex items-center justify-center relative">
                      <Video className="w-12 h-12 text-muted-foreground" />
                      {item.videos[0]?.thumbnail_url && (
                        <img
                          src={item.videos[0].thumbnail_url}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-50"
                          loading="lazy"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  {item.is_before_after && (
                    <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Before/After
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {item.category?.name && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        {item.category.name}
                      </span>
                    )}
                    {item.service?.name && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        {item.service.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Images className="w-3 h-3" />
                      {item.pictures?.length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      {item.videos?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1"
                    >
                      <Link to={`/admin/portfolio/${item.id}`}>
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1"
                    >
                      <Link to={`/admin/portfolio/${item.id}/media`}>
                        <Images className="w-3 h-3 mr-1" />
                        Media
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(item.id)}
                      className="flex-1 sm:flex-none"
                    >
                      <Trash2 className="w-3 h-3 sm:mr-0" />
                      <span className="sm:hidden ml-1">Delete</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            onPageChange={loadItems}
            loading={loading}
          />
        </>
      )}

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this portfolio item and all
              associated images and videos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PortfolioItems;
