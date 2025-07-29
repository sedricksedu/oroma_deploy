import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";

interface UsernameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (username: string) => void;
  title: string;
  description: string;
}

export function UsernameDialog({ isOpen, onClose, onSubmit, title, description }: UsernameDialogProps) {
  const [username, setUsername] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to continue",
        variant: "destructive",
      });
      return;
    }

    if (username.length < 2) {
      toast({
        title: "Username too short",
        description: "Username must be at least 2 characters long",
        variant: "destructive",
      });
      return;
    }

    onSubmit(username.trim());
    setUsername("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-red-600" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              maxLength={20}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be displayed with your {title.toLowerCase()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
              Continue
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}