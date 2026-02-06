import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase-client";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateUserSettings } from "@/services/settings/actions";

interface AvatarUploadProps {
  currentUrl: string | null;
  name: string;
  onSuccess: (newUrl: string) => void;
}

export function AvatarUpload({
  currentUrl,
  name,
  onSuccess,
}: AvatarUploadProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentUrl || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (e.g. 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File is too large (max 2MB)");
      return;
    }

    setIsUploading(true);
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update user settings
      await updateUserSettings({ avatar_url: publicUrl });

      toast.success("Avatar updated!");
      setPreviewUrl(publicUrl);
      onSuccess(publicUrl);
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload avatar.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex items-center gap-6">
      <div className="relative group">
        <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
          <AvatarImage src={previewUrl} className="object-cover" />
          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
            {initials || "U"}
          </AvatarFallback>
        </Avatar>
        <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <Camera className="h-6 w-6 text-white" />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-lg">{name}</h4>
        <p className="text-sm text-muted-foreground">
          JPG, GIF or PNG. Max size 2MB.
        </p>
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg text-xs"
            onClick={() => document.getElementById("avatar-input")?.click()}
            disabled={isUploading}
          >
            Upload New
          </Button>
          <input
            id="avatar-input"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}
