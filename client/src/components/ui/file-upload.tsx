import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function FileUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10, 
  className 
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      const img = new Image();
      
      img.onload = () => {
        try {
          // Calculate new dimensions (max 800px width/height)
          let { width, height } = img;
          const maxSize = 800;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          // Clean up object URL
          URL.revokeObjectURL(img.src);
          resolve(compressedDataUrl);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || isProcessing) return;

    setIsProcessing(true);
    const remainingSlots = maxImages - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    const newImages: string[] = [];

    for (const file of filesToProcess) {
      if (file.type.startsWith('image/')) {
        try {
          const compressedImage = await compressImage(file);
          if (compressedImage) {
            newImages.push(compressedImage);
          }
        } catch (error) {
          console.error('Error compressing image:', error);
          // Fallback: use original file as data URL
          try {
            const reader = new FileReader();
            const originalImage = await new Promise<string>((resolve, reject) => {
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
            newImages.push(originalImage);
          } catch (fallbackError) {
            console.error('Fallback image processing failed:', fallbackError);
          }
        }
      }
    }

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages];
      console.log('Setting images:', updatedImages.length);
      onImagesChange(updatedImages);
    }
    setIsProcessing(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    await handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-gray-300 hover:border-gray-400",
          images.length >= maxImages && "opacity-50 cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={images.length < maxImages ? openFileDialog : undefined}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <Upload className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                {isProcessing 
                  ? "Processing images..."
                  : images.length >= maxImages 
                  ? `Maximum ${maxImages} images reached`
                  : "Upload Images"
                }
              </h3>
              {images.length < maxImages && !isProcessing && (
                <p className="text-gray-500 mb-4">
                  Drag and drop images here, or click to browse
                  <br />
                  <span className="text-sm">
                    {images.length}/{maxImages} images selected
                  </span>
                </p>
              )}
              {isProcessing && (
                <p className="text-blue-600 mb-4">
                  Compressing and optimizing images...
                </p>
              )}
            </div>
            {images.length < maxImages && (
              <Button type="button" variant="outline">
                <FileImage className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={async (e) => await handleFileSelect(e.target.files)}
      />

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <Image className="h-4 w-4" />
              Selected Images ({images.length})
            </h4>
            <Badge variant="secondary">
              {images.length}/{maxImages}
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="relative group overflow-hidden">
                <div className="aspect-square">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-2 bg-white">
                  <p className="text-xs text-gray-500 truncate">
                    Image {index + 1}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}