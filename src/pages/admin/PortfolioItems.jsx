import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Images, Video, Search } from "lucide-react";
import { api } from "@/lib/api";
import { notify } from "@/utils/notify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

const PortfolioItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const params = useMemo(() => {
    const query = new URLSearchParams();
    if (search.trim()) query.set("search", search.trim());
    return query.toString() ? query : null;
  }, [search]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await api.getPortfolioItems(params);
      setItems(data?.results || []);
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
    loadItems();
  }, [params]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await api.deletePortfolioItem(deleteId);
      notify({ title: "Success", description: "Portfolio item deleted." });
      loadItems();
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

  if (loading) {
    return (
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Items</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/portfolio/new">
            <Plus className="mr-2 h-4 w-4" />
            New Item
          </Link>
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            {item.thumbnail_url && (
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="h-48 w-full object-cover"
                loading="lazy"
              />
            )}
            <div className="space-y-2 p-4">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {item.description}
              </p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Images className="h-3 w-3" />
                  {item.pictures?.length || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Video className="h-3 w-3" />
                  {item.videos?.length || 0}
                </span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to={`/admin/portfolio/${item.id}`}>
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to={`/admin/portfolio/${item.id}/media`}>
                    <Images className="mr-1 h-3 w-3" />
                    Media
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteId(item.id)}
                  className="flex-none"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the portfolio item and all associated
              media.
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
