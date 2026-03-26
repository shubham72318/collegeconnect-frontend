import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import CollegeSidebar from "@/components/CollegeSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CollegeProfile = () => {
  const { user, profile, loading } = useAuth();
  const [collegeName, setCollegeName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    setCollegeName(profile?.college_name ?? "");
  }, [loading, profile?.college_name]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        college_name: collegeName.trim() || null,
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    toast.success("Profile updated.");
    setSaving(false);
  };

  return (
    <DashboardLayout title="College Profile" theme="college" sidebar={<CollegeSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Your Profile</h2>
          <p className="text-muted-foreground">
            College name is saved during signup, but you can update it here if needed.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>College Info</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSave}>
              <div className="space-y-2">
                <Label htmlFor="collegeName">College Name</Label>
                <Input
                  id="collegeName"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g., MIT"
                  required
                />
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CollegeProfile;

