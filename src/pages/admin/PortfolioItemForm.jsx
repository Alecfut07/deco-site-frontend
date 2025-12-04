import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Switch } from "@/components/ui/switch";
import { notify } from "@/utils/notify";
import { ArrowLeft, Loader2 } from "lucide-react";

const PortfolioItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    service_id: "",
    is_before_after: false,
    image: null,
    before_image: null,
    after_image: null,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [cats, servs] = await Promise.all([
          api.getCategories(),
          api.getServices(),
        ]);

        // Handle both array and paginated response formats
        const categoriesList = Array.isArray(cats) ? cats : cats?.results || [];
        const servicesList = Array.isArray(servs)
          ? servs
          : servs?.results || [];

        setCategories(categoriesList);
        setServices(servicesList);

        if (id) {
          const item = await api.getPortfolioItem(Number(id));
          setFormData({
            title: item.title || "",
            description: item.description || "",
            category_id: item.category?.id
              ? String(item.category.id)
              : item.category_id
              ? String(item.category_id)
              : "",
            service_id: item.service?.id
              ? String(item.service.id)
              : item.service_id
              ? String(item.service_id)
              : "",
            is_before_after:
              item.is_before_after || item.has_before_after || false,
            image: null,
            before_image: null,
            after_image: null,
          });
        }
      } catch (error) {
        notify({
          title: "Error",
          description: "Failed to load form data.",
          variant: "destructive",
        });
      }
    };

    load();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category_id", formData.category_id);
      data.append("service_id", formData.service_id);
      data.append("is_before_after", formData.is_before_after.toString());

      if (formData.image) data.append("image", formData.image);
      if (formData.before_image)
        data.append("before_image", formData.before_image);
      if (formData.after_image)
        data.append("after_image", formData.after_image);

      if (id) {
        await api.updatePortfolioItem(Number(id), data);
        notify({ title: "Success", description: "Portfolio item updated." });
      } else {
        await api.createPortfolioItem(data);
        notify({ title: "Success", description: "Portfolio item created." });
      }

      navigate("/admin/portfolio");
    } catch (error) {
      notify({
        title: "Error",
        description: error?.data?.detail || "Failed to save portfolio item.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/portfolio")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {id ? "Edit" : "New"} Portfolio Item
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(event) =>
                  setFormData({ ...formData, title: event.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                row={4}
                value={formData.description}
                onChange={(event) =>
                  setFormData({ ...formData, description: event.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                  required
                >
                  <SelectTrigger>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Service *</Label>
                <Select
                  value={formData.service_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, service_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((svc) => (
                      <SelectItem key={svc.id} value={svc.id.toString()}>
                        {svc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="before-after"
                checked={formData.is_before_after}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    is_before_after: checked,
                  })
                }
              />
              <Label htmlFor="before-after">Before/After Project</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Main Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    image: event.target.files?.[0] || null,
                  })
                }
              />
            </div>

            {formData.is_before_after && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="before">Before Image</Label>
                  <Input
                    id="before"
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        before_image: event.target.files?.[0] || null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="after">After Image</Label>
                  <Input
                    id="after"
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        after_image: event.target.files?.[0] || null,
                      })
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/portfolio")}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioItemForm;
