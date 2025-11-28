import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notify } from "@/utils/notify";
import { ArrowLeft, Trash2 } from "lucide-react";
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

const PortfolioItemMedia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadItem = async () => {
    const data = await api.getPortfolioItem(id);
    setItem(data);
  };

  useEffect(() => {
    loadItem();
  }, [id]);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("portfolio_item_id", String(id));
        formData.append("image", file);
        await api.createPortfolioImage(formData);
      }

      notify({
        title: "Success",
        description: "Images uploaded",
      });
      loadItem();
    } catch (error) {
      notify({
        title: "Error",
        description: error?.data?.detail || "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleVideoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("portfolio_item_id", id);
        formData.append("video", file);
        await api.createPortfolioVideo(formData);
      }
      notify({ title: "Success", description: "Videos uploaded" });
      loadItem();
    } catch (error) {
      notify({
        title: "Error",
        description: error?.data?.detail || "Failed to upload videos",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "image") {
        await api.deletePortfolioImage(deleteTarget.id);
      } else {
        await api.deletePortfolioVideo(deleteTarget.id);
      }
      notify({ title: "Success", description: "Deleted successfully." });
      loadItem();
    } catch (error) {
      notify({
        title: "Error",
        description: error?.data?.detail || "Failed to delete",
        variant: "destructive",
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  if (!item) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/portfolio")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Manage Media</h1>
          <p claasName="text-sm sm:text-base text-muted-foreground">
            {item.title}
          </p>
        </div>
      </div>

      <Tabs defaultValue="pictures">
        <TabsList>
          <TabsTrigger value="pictures">
            Pictures ({item.pictures?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="videos">
            Videos ({item.videos?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pictures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Pictures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="image-upload">Select images to upload</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {item.pictures?.map((pic) => (
              <Card key={pic.id} className="overflow-hidden">
                <img
                  src={pic.thumbnail_url}
                  alt={pic.caption || ""}
                  className="w-full h-32 sm:h-48 object-cover"
                />
                <div className="p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      setDeleteTarget({ type: "image", id: pic.id })
                    }
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="video-upload">Select videos to upload</Label>
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoUpload}
                  disabled={uploading}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {item.videos?.map((vid) => (
              <Card key={vid.id} className="overflow-hidden">
                <img
                  src={vid.thumbnail_url}
                  alt={vid.caption || ""}
                  className="w-full h-32 sm:h-48 object-cover"
                />
                <div className="p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      setDeleteTarget({ type: "video", id: vid.id })
                    }
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this {deleteTarget?.type}.
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

export default PortfolioItemMedia;
