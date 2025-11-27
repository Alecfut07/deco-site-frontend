import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notify } from "@/utils/notify";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const Services = () => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const loadServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (error) {
      notify({
        title: "Error",
        description: "Failed to load services.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingService?.id) {
        await api.updateService(editingService.id, formData);
        notify({ title: "Success", description: "Service updated." });
      } else {
        await api.createService(formData);
        notify({ title: "Success", description: "Service created." });
      }

      setEditingService(null);
      setFormData({ name: "", description: "" });
      loadServices();
    } catch (error) {
      notify({
        title: "Error",
        description: error?.data?.detail || "Failed to save service.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await api.deleteService(deleteId);
      notify({ title: "Deleted", description: "Service removed." });
      loadServices();
    } catch (error) {
      notify({
        title: "Error",
        description: error?.data?.detail || "Failed to delete service.",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const openEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">
            Manage the services you offer.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingService({});
            setFormData({ name: "", description: "" });
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Service
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {services.map((svc) => (
          <Card key={svc.id}>
            <CardHeader>
              <CardTitle>{svc.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {svc.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(svc)}
                  className="flex-1"
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteId(svc.id)}
                  className="flex-1"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={editingService !== null}
        onOpenChange={() => setEditingService(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingService?.id ? "Edit" : "New"} Service
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(event) =>
                  setFormData({ ...formData, name: event.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                row={3}
                value={formData.description}
                onChange={(event) =>
                  setFormData({ ...formData, description: event.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this service.
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

export default Services;
