import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, X, Image } from "lucide-react";

interface SimpleFileUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function SimpleFileUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10 
}: SimpleFileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || isLoading) return;
    
    setIsLoading(true);
    const remainingSlots = maxImages - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    
    let processedCount = 0;
    const newImages: string[] = [];

    filesToProcess.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            newImages.push(result);
          }
          processedCount++;
          
          if (processedCount === filesToProcess.length) {
            onImagesChange([...images, ...newImages]);
            setIsLoading(false);
          }
        };
        reader.onerror = () => {
          processedCount++;
          if (processedCount === filesToProcess.length) {
            onImagesChange([...images, ...newImages]);
            setIsLoading(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        processedCount++;
        if (processedCount === filesToProcess.length) {
          onImagesChange([...images, ...newImages]);
          setIsLoading(false);
        }
      }
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || images.length >= maxImages}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isLoading ? "Processing..." : "Choose Images"}
        </Button>
        <span className="text-sm text-gray-500">
          {images.length}/{maxImages} images selected
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <div className="aspect-square">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}