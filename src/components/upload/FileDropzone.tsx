import { useCallback, useRef, useState } from "react";
import { Mascot } from "@/components/brand/Mascot";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  disabled?: boolean;
  onFilesSelected: (files: File[]) => void | Promise<void>;
}

export function FileDropzone({ disabled, onFilesSelected }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || disabled) return;
      const files = [...fileList].filter((file) =>
        file.name.toLowerCase().endsWith(".csv"),
      );
      if (files.length === 0) return;
      await onFilesSelected(files);
    },
    [disabled, onFilesSelected],
  );

  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-border bg-card p-8 text-center transition-colors",
        isDragging && "border-primary bg-accent/40",
        disabled && "opacity-60",
      )}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        void handleFiles(event.dataTransfer.files);
      }}
    >
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
        <Mascot
          size="xl"
          decorative
          className={cn(
            "border-primary/20 shadow-md transition-transform",
            isDragging && "scale-105 border-primary/40",
          )}
        />
        <div className="flex flex-col gap-2">
          <p className="text-lg font-medium">Drop your Amazon export CSVs here</p>
          <p className="text-sm text-muted-foreground">
            Order History, Digital Content Orders, Cart History, returns files, and more.
          </p>
        </div>
        <Button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          Choose files
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          multiple
          className="hidden"
          onChange={(event) => {
            void handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>
    </div>
  );
}