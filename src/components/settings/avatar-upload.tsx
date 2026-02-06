"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
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
  const [url, setUrl] = useState(currentUrl || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!url) return;
    setIsSaving(true);
    try {
      await updateUserSettings({ avatar_url: url });
      onSuccess(url);
      setOpen(false);
    } catch (error) {
      console.error("Failed to update avatar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20 ring-2 ring-primary/10">
        <AvatarImage src={currentUrl || "https://github.com/shadcn.png"} />
        <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
          {initials || "U"}
        </AvatarFallback>
      </Avatar>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Change Avatar</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Change Avatar</DialogTitle>
            <DialogDescription>
              Enter a URL for your new profile picture.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="https://example.com/avatar.jpg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={isSaving || !url}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Avatar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
