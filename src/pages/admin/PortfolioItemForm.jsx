import { useEffect, useState, useRef, useCallback } from "react";
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
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const validateImageFile = (file) => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please select a JPG, PNG, GIF, or WebP.",
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${formatFileSize(
        MAX_FILE_SIZE
      )}. Please select a smaller file.`,
    };
  }
  return {
    valid: true,
  };
};

const ImageUploadField = ({
  id,
  label,
  file,
  existingUrl,
  onFileChange,
  error,
}) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);

  // Generate preview when file changes
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFileInfo({
        size: formatFileSize(file.size),
      });

      // Get image dimensions
      const img = new window.Image();
      img.onload = () => {
        setFileInfo((prev) =>
          prev ? { ...prev, dimensions: `${img.width} x ${img.height}` } : null
        );
      };
      img.src = url;

      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
      setFileInfo(null);
    }
  }, [file]);

  const handleFileSelect = useCallback(
    (selectedFile) => {
      const validation = validateImageFile(selectedFile);
      if (!validation.valid) {
        notify({
          title: "Invalid File",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }
      onFileChange(selectedFile);
    },
    [onFileChange]
  );

  const handleInputChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleRemove = () => {
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      {/* Existing image preview (when editing) */}
      {existingUrl && !preview && (
        <div className="mb-3">
          <p className="text-xs text-muted-foreground">Current image:</p>
          <div className="relative inline-block">
            <img
              src={existingUrl}
              alt={`Current ${label}`}
              className="max-w-[200px] sm:max-w-[300px] h-auto rounded-lg border border-border object-cover"
            />
          </div>
        </div>
      )}

      {/* New file preview */}
      {preview && (
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-2">
            New image preview:
          </p>
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="max-w-[200px] sm:max-w-[300px] h-auto rounded-lg border border-border object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full shadow-md hover:bg-destructive/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {fileInfo && (
            <p>
              {fileInfo.size}
              {fileInfo.dimensions && ` • ${fileInfo.dimensions}`}
            </p>
          )}
        </div>
      )}

      {/* Drop zone / File input */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 cursor-pointer
          transition-all duration-200 text-center
          ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-primary/50"
          }
          ${error ? "border-destructive" : ""}
          `}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          {isDragging ? (
            <>
              <Upload className="w-8 h-8 text-primary" />
              <p className="text-sm font-medium text-primary">
                Drop image here
              </p>
            </>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, GIF, or WebP (max {formatFileSize(MAX_FILE_SIZE)})
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1 text-destructive text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

const PortfolioItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [existingImages, setExistingImages] = useState({});
  const [errors, setErrors] = useState({});

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
          setExistingImages({
            image_url: item.image_url || item.thumbnail_url,
            before_image_url: item.before_image_url,
            after_image_url: item.after_image_url,
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.category_id) {
      newErrors.category_id = "Category is required";
    }
    if (!formData.service_id) {
      newErrors.service_id = "Service is required";
    }

    // Validate files if selected
    if (formData.image) {
      const validation = validateImageFile(formData.image);
      if (!validation.valid) newErrors.iamge = validation.error;
    }
    if (formData.before_image) {
      const validation = validateImageFile(formData.before_image);
      if (!validation.valid) newErrors.before_image = validation.error;
    }
    if (formData.after_image) {
      const validation = validateImageFile(formData.after_image);
      if (!validation.valid) newErrors.after_image = validation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      notify({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

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
