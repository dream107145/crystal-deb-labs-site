"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, ImagePlus } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  bucket?: "portfolio" | "email-assets";
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  bucket = "portfolio",
  className,
}: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      onChange(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <span className="block text-sm font-medium text-white">{label}</span>
      {value ? (
        <div className="relative w-full max-w-xs aspect-video rounded-xl overflow-hidden border border-white/10">
          <Image src={value} alt={label} fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center w-full max-w-xs aspect-video rounded-xl border-2 border-dashed border-white/20 hover:border-crystal-cyan/50 transition-colors text-muted hover:text-white"
        >
          <Upload size={24} className="mb-2" />
          <span className="text-sm">{uploading ? "Uploading..." : "Click to upload"}</span>
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      {!value && (
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} isLoading={uploading}>
          <Upload size={16} /> Upload Image
        </Button>
      )}
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

export function MultiImageUpload({
  values,
  onChange,
  label = "Screenshots",
}: MultiImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", "portfolio");
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        newUrls.push(json.url);
      }
      onChange([...values, ...newUrls]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeAt = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-white">{label}</span>
      <div className="flex flex-wrap gap-3">
        {values.map((url, i) => (
          <div key={url} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10">
            <Image src={url} alt={`Screenshot ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white"
              aria-label="Remove"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} isLoading={uploading}>
        <ImagePlus size={16} /> Add Screenshots
      </Button>
    </div>
  );
}
