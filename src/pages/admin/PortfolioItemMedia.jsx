import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { notify } from "@/utils/notify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    if (!id) return;
    const data = await api.getPortfolioItem(id);
    setItem(data);
  };

  useEffect(() => {
    loadItem();
  }, [id]);

  const handleFilesUpload = async (files, type) => {
    if (!files || files.length === 0 || !id) return;

    setUploading(true);
    try {
      const endpoint =
        type === "image" ? api.createPortfolioImage : api.createPortfolioVideo;

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("portfolio_item_id", String(id));
        formData.append(type, file);
        await endpoint(formData);
      }

      notify({
        title: "Success",
        description: `${type === "image" ? "Images" : "Videos"} uploaded.`,
      });
      loadItem();
    } catch (error) {
      notify({
        title: "Upload failed",
        description:
          error?.data?.detail ||
          `Unable to upload ${type === "image" ? "images" : "videos"}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onImageUpload = (event) => {
    handleFilesUpload(event.target.files, "image");
    event.target.value = "";
  };

  const onVideoUpload = (event) => {
    handleFilesUpload(event.target.files, "video");
    event.target.value = "";
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "image") {
        await api.deletePortfolioImage(deleteTarget.id);
      } else {
        await api.deletePortfolioVideo(deleteTarget.id);
      }
      notify({ title: "Deleted", description: "Media removed successfully." });
      loadItem();
    } catch (error) {
      notify({
        title: "Error",
        description: error?.data?.detail || "Failed to delete media.",
        variant: "destructive",
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  if (!item) {
    return (
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/portfolio")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Manage Media</h1>
          <p claasName="text-muted-foreground">{item.title}</p>
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
                  onChange={onImageUpload}
                  disabled={uploading}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {item.pictures?.map((pic) => (
              <Card key={pic.id} className="overflow-hidden">
                <img
                  src={pic.thumbnail_url}
                  alt={pic.caption || ""}
                  className="h-48 w-full object-cover"
                  loading="lazy"
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
                    <Trash2 className="mr-1 h-3 w-3" />
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
                  onChange={onVideoUpload}
                  disabled={uploading}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {item.videos?.map((vid) => (
              <Card key={vid.id} className="overflow-hidden">
                <img
                  src={vid.thumbnail_url}
                  alt={vid.caption || ""}
                  className="h-48 w-full object-cover"
                  loading="lazy"
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
                    <Trash2 className="mr-1 h-3 w-3" />
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
              This will permanently delete the selected {deleteTarget?.type}.
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
