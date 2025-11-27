import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { notify } from "@/utils/notify";
import { Plus, Pencil, Trash2, Images, Video, Search } from "lucide-react";
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

  const loadItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const data = await api.getPortfolioItems(params);
      setItems(data.results || []);
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
  }, [search]);

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
    return <div className="animate-pulse">Loading...</div>;
  }

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

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            {item.thumbnail_url && (
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            )}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-lg">{item.title}</h3>
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
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to={`/admin/portfolio/${item.id}`}>
                    <Pencil className="w-3 h-3 mr-1" />
                    <span className="sm:hidden">Edit</span>
                    <span className="hidden sm:inline">Edit</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to={`/admin/portfolio/${item.id}/media`}>
                    <Images className="w-3 h-3 mr-1" />
                    <span className="sm:hidden">Media</span>
                    <span className="hidden sm:inline">Media</span>
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
