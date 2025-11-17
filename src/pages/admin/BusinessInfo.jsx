import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { notify } from "@/utils/notify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BusinessInfo = () => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    specialties: "",
    years_experience: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getBusinessInfo();
        setFormData({
          name: data?.name || "",
          tagline: data?.tagline || "",
          phone: data?.phone || "",
          email: data?.email || "",
          address: data?.address || "",
          description: data?.description || "",
          specialties: data?.specialties || "",
          years_experience: data?.years_experience || 0,
        });
      } catch (error) {
        notify({
          title: "Error",
          description: "Failed to load business info.",
          variant: "destructive",
        });
      }
    };

    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await api.updateBusinessInfo(formData);
      notify({ title: "Success", description: "Business info updated." });
    } catch (error) {
      notify({
        title: "Error",
        description: error?.data?.detail || "Failed to update business info.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Business Information</h1>
        <p className="text-muted-foreground">Update your company details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="business-name">Business Name *</Label>
              <Input
                id="business-name"
                value={formData.name}
                onChange={(event) =>
                  setFormData({ ...formData, name: event.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-tagline">Tagline</Label>
              <Input
                id="business-tagline"
                value={formData.tagline}
                onChange={(event) =>
                  setFormData({ ...formData, tagline: event.target.value })
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="business-phone">Phone *</Label>
                <Input
                  id="business-phone"
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData({ ...formData, phone: event.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-email">Email *</Label>
                <Input
                  id="business-email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({ ...formData, email: event.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-address">Address</Label>
              <Input
                id="business-address"
                value={formData.address}
                onChange={(event) =>
                  setFormData({ ...formData, address: event.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-description">Description</Label>
              <Textarea
                id="business-description"
                rows={4}
                value={formData.description}
                onChange={(event) =>
                  setFormData({ ...formData, description: event.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-specialties">
                Specialties (comma-separated)
              </Label>
              <Input
                id="business-specialties"
                value={formData.specialties}
                onChange={(event) =>
                  setFormData({ ...formData, specialties: event.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-years">Years of Experience</Label>
              <Input
                id="business-years"
                type="number"
                min={0}
                value={formData.years_experience}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    years_experience:
                      Number.parseInt(event.target.value, 10) || 0,
                  })
                }
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessInfo;
