import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
import { notify } from "@/utils/notify";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
  Plus,
  Video,
  Trash2,
  Loader2,
} from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
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

const validateVideoFile = (file) => {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please select a MP4, WebM, MOV, or AVI.",
    };
  }
  if (file.size > MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${formatFileSize(
        MAX_VIDEO_SIZE
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
            <p className="text-xs text-muted-foreground mt-2">
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

const MultiMediaSection = ({
  type,
  existingItems,
  newFiles,
  onAddFiles,
  onRemoveNew,
  onDeleteExisting,
  deletingIds,
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const isImage = type === "image";
  const accept = isImage ? "image/*" : "video/*";
  const maxSize = isImage ? MAX_FILE_SIZE : MAX_VIDEO_SIZE;
  const Icon = isImage ? ImageIcon : Video;

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
    if (e.dataTransfer.files.length > 0) {
      onAddFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      e.target.value = "";
    }
  };

  const totalCount = existingItems.length + newFiles.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">
          {isImage ? "Gallery Images" : "Gallery Videos"}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({existingItems.length} existing
            {newFiles.length > 0 ? ` + ${newFiles.length} new` : ""})
          </span>
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add {isImage ? "Images" : "Videos"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Drop zone when empty */}
      {totalCount === 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 cursor-pointer text-center
            transition-all duration-200
            ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }
          `}
        >
          <Icon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-primary">Click to upload</span> or
            drag and drop
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isImage ? "JPG, PNG, GIF, or WebP" : "MP4, WebM, MOV, or AVI"} (max{" "}
            {formatFileSize(maxSize)})
          </p>
        </div>
      )}

      {/* Media grid */}
      {totalCount > 0 && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3
            p-3 rounded-lg border-2 border-dashed transition-all duration-200
            ${isDragging ? "border-primary bg-primary/5" : "border-transparent"}
          `}
        >
          {/* Existing items */}
          {existingItems.map((item) => {
            const isDeleting = deletingIds.includes(item.id);
            const thumbnailUrl =
              item.thumbnail_url || (isImage ? item.image_url : undefined);

            return (
              <div
                key={`existing-${item.id}`}
                className="relative group aspect-square"
              >
                {isImage ? (
                  <img
                    src={thumbnailUrl}
                    alt={item.caption || `${type} ${item.id}`}
                    className="w-full h-full object-cover rounded-lg border border-border"
                  />
                ) : (
                  <div className="w-full h-full rounded-lg border border-border bg-muted flex items-center justify-center relative overflow-hidden">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={item.caption || `Video ${item.id}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Video className="w-10 h-10 text-muted-foreground" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center">
                        <Video className="w-5 h-5 text-foreground" />
                      </div>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(item.id)}
                  disabled={isDeleting}
                  className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-md hover:bg-destructive/90 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3" />
                  )}
                </button>
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[10px] bg-background/80 rounded text-muted-foreground">
                  Saved
                </span>
              </div>
            );
          })}

          {/* New files */}
          {newFiles.map((item) => (
            <div key={item.id} className="relative group aspect-square">
              {isImage ? (
                <img
                  src={item.preview}
                  alt="New upload"
                  className="w-full h-full object-cover rounded-lg border-2 border-primary/50"
                />
              ) : (
                <div className="w-full h-full rounded-lg border-2 border-primary/50 bg-muted flex items-center justify-center relative overflow-hidden">
                  <video
                    src={item.preview}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center">
                      <Video className="w-5 h-5 text-foreground" />
                    </div>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => onRemoveNew(item.id)}
                className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-md hover:bg-destructive/90 transition-all opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[10px] bg-primary/80 text-primary-foreground rounded">
                New
              </span>
            </div>
          ))}

          {/* Add more button in grid */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-border hober:border-primary/50 hover:bg-muted/50 flex flex-col items-center justify-center gap-1 transition-all"
          >
            <Plus className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Add more</span>
          </button>
        </div>
      )}

      {/* Delte confirmation dialog */}
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {isImage ? "Image" : "Video"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this {type} from the portfolio item.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm !== null) {
                  onDeleteExisting(deleteConfirm);
                  setDeleteConfirm(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

  // Gallery images and videos
  const [existingPictures, setExistingPictures] = useState([]);
  const [existingVideos, setExistingVideos] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [deletingImageIds, setDeletingImageIds] = useState([]);
  const [deletingVideoIds, setDeletingVideoIds] = useState([]);

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
          setExistingPictures(item.pictures || []);
          setExistingVideos(item.videos || []);
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
      if (!validation.valid) newErrors.image = validation.error;
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

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      newImages.forEach((img) => URL.revokeObjectURL(img.preview));
      newVideos.forEach((vid) => URL.revokeObjectURL(vid.preview));
    };
  }, []);

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
                onChange={(event) => {
                  setFormData({ ...formData, title: event.target.value });
                  if (errors.title) setErrors({ ...errors, title: "" });
                }}
                className={errors.title ? "border-destructive" : ""}
                required
              />
              {errors.title && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(event) => {
                  setFormData({ ...formData, description: event.target.value });
                  if (errors.description)
                    setErrors({ ...errors, description: "" });
                }}
                className={errors.description ? "border-destructive" : ""}
                required
              />
              {errors.description && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.description}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => {
                    setFormData({ ...formData, category_id: value });
                    if (errors.category_id)
                      setErrors({ ...errors, category_id: "" });
                  }}
                  required
                >
                  <SelectTrigger
                    className={errors.category_id ? "border-destructive" : ""}
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
                {errors.category_id && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.category_id}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Service *</Label>
                <Select
                  value={formData.service_id}
                  onValueChange={(value) => {
                    setFormData({ ...formData, service_id: value });
                    if (errors.service_id)
                      setErrors({ ...errors, service_id: "" });
                  }}
                  required
                >
                  <SelectTrigger
                    className={errors.service_id ? "border-destructive" : ""}
                  >
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
                {errors.service_id && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.service_id}
                  </p>
                )}
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
              <ImageUploadField
                id="image"
                label="Main Image"
                file={formData.image}
                existingUrl={existingImages.image_url}
                onFileChange={(file) =>
                  setFormData({ ...formData, image: file })
                }
                error={errors.image}
              />
            </div>

            {formData.is_before_after && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <ImageUploadField
                    id="before"
                    label="Before Image"
                    file={formData.before_image}
                    existingUrl={existingImages.before_image_url}
                    onFileChange={(file) =>
                      setFormData({ ...formData, before_image: file })
                    }
                    error={errors.before_image}
                  />
                </div>
                <div className="space-y-2">
                  <ImageUploadField
                    id="after"
                    label="After Image"
                    file={formData.after_image}
                    existingUrl={existingImages.after_image_url}
                    onFileChange={(file) =>
                      setFormData({ ...formData, after_image: file })
                    }
                    error={errors.after_image}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center gap-2"
              >
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
