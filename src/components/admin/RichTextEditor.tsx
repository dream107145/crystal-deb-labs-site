"use client";

import { useRef, useCallback, useEffect } from "react";
import { Bold, Italic, Underline, Link, ImageIcon, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your email content...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const syncContent = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const exec = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    syncContent();
  };

  const handleLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) exec("createLink", url);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "email-assets");

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      exec("insertImage", json.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-white/10 bg-white/5">
        <ToolbarButton onClick={() => exec("bold")} label="Bold">
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("italic")} label="Italic">
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("underline")} label="Underline">
          <Underline size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={handleLink} label="Insert link">
          <Link size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("insertUnorderedList")} label="Bullet list">
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => fileRef.current?.click()} label="Insert image">
          <ImageIcon size={16} />
        </ToolbarButton>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncContent}
        onBlur={syncContent}
        data-placeholder={placeholder}
        className={cn(
          "min-h-[200px] p-4 text-white outline-none",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-white/40",
          "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-2",
          "[&_a]:text-crystal-cyan [&_a]:underline",
          "[&_ul]:list-disc [&_ul]:pl-6"
        )}
      />
    </div>
  );
}

function ToolbarButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="p-2 rounded-lg text-muted hover:text-white hover:bg-white/10 transition-colors"
    >
      {children}
    </button>
  );
}
