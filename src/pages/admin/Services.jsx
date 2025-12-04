import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notify } from "@/utils/notify";
import {
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  Search,
  X,
  Loader2,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const PAGE_SIZE = 20;

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await api.getCategories();
        // Handle both array and paginated response formats
        const categoriesList = Array.isArray(data) ? data : data?.results || [];
        setCategories(categoriesList);
      } catch (error) {
        console.error("Failed to load categories: ", error);
      }
    };
    loadCategories();
  }, []);

  const loadServices = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (search) params.set("search", search);

      const data = await api.getAdminServices(params);
      setServices(data.results || []);
      setTotalCount(data.count || 0);
      setHasNext(!!data.next);
      setHasPrevious(!!data.previous);
      setCurrentPage(page);
    } catch (error) {
      notify({
        title: "Error",
        description: "Failed to load services.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadServices(1);
    }, 400);
    return () => clearTimeout(debounce);
  }, [search]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.category_id) errors.category_id = "Category is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        category_id: parseInt(formData.category_id),
      };

      if (editingService?.id) {
        await api.updateService(editingService.id, submitData);
        notify({ title: "Success", description: "Service updated." });
      } else {
        await api.createService(submitData);
        notify({ title: "Success", description: "Service created." });
      }

      setEditingService(null);
      setFormData({ name: "", description: "", category_id: "" });
      setFormErrors({});
      loadServices(currentPage);
    } catch (error) {
      const apiErrors = error.data || {};
      if (apiErrors.name) {
        setFormErrors((prev) => ({
          ...prev,
          name: Array.isArray(apiErrors.name)
            ? apiErrors.name.join(", ")
            : apiErrors.name,
        }));
      }
      if (apiErrors.category_id) {
        setFormErrors((prev) => ({
          ...prev,
          category_id: Array.isArray(apiErrors.category_id)
            ? apiErrors.category_id.join(", ")
            : apiErrors.category_id,
        }));
      }
      notify({
        title: "Error",
        description: error?.data?.detail || "Failed to save service.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await api.deleteService(deleteId);
      notify({ title: "Deleted", description: "Service removed." });
      loadServices(currentPage);
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
      description: service.description || "",
      category_id: service.category?.id
        ? String(service.category.id)
        : service.category_id
        ? String(service.category_id)
        : "",
    });
    setFormErrors({});
  };

  const openNew = () => {
    setEditingService({});
    setFormData({ name: "", description: "", category_id: "" });
    setFormErrors({});
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
        <Button onClick={openNew} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Service
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search services..."
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
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <SkeletonGrid count={6} variant="service" />
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={search ? "No services found" : "No services yet"}
          description={
            search
              ? "Try adjusting your search terms"
              : "Create your first service to showcase what you offer"
          }
          actionLabel={!search ? "Create Service" : undefined}
          onAction={!search ? openNew : undefined}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {services.map((svc) => (
              <Card
                key={svc.id}
                className="group transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle>{svc.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {svc.category?.name && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full inline-block">
                      {svc.category.name}
                    </span>
                  )}
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

          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            onPageChange={loadServices}
            loading={loading}
          />
        </>
      )}

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
                onChange={(event) => {
                  setFormData({ ...formData, name: event.target.value });
                  if (formErrors.name) {
                    setFormErrors((prev) => ({ ...prev, name: "" }));
                  }
                }}
                className={formErrors.name ? "border-destructive" : ""}
                required
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => {
                  setFormData({ ...formData, category_id: value });
                  if (formErrors.category_id) {
                    setFormErrors((prev) => ({ ...prev, category_id: "" }));
                  }
                }}
                required
              >
                <SelectTrigger
                  className={formErrors.category_id ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.category_id && (
                <p className="text-sm text-destructive">
                  {formErrors.category_id}
                </p>
              )}
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
              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {submitting ? "Saving..." : "Save"}
              </Button>
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
