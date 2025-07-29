import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const programProposalSchema = z.object({
  proposerName: z.string().min(2, "Name must be at least 2 characters"),
  proposerEmail: z.string().email("Please enter a valid email address"),
  proposerPhone: z.string().optional(),
  organization: z.string().optional(),
  programTitle: z.string().min(3, "Program title must be at least 3 characters"),
  programDescription: z.string().min(50, "Please provide a detailed description (at least 50 characters)"),
  category: z.string().min(1, "Please select a category"),
  duration: z.string().optional(),
  targetAudience: z.string().optional(),
  proposedSchedule: z.string().optional(),
  resources: z.string().optional(),
  experience: z.string().optional(),
});

type ProgramProposalForm = z.infer<typeof programProposalSchema>;

interface ProgramProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  "News & Current Affairs",
  "Education",
  "Agriculture",
  "Health",
  "Youth & Entertainment",
  "Culture & Arts",
  "Business & Economy",
  "Sports",
  "Community Development",
  "Technology",
  "Environment",
  "Other"
];

export function ProgramProposalModal({ isOpen, onClose }: ProgramProposalModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ProgramProposalForm>({
    resolver: zodResolver(programProposalSchema),
    defaultValues: {
      proposerName: "",
      proposerEmail: "",
      proposerPhone: "",
      organization: "",
      programTitle: "",
      programDescription: "",
      category: "",
      duration: "",
      targetAudience: "",
      proposedSchedule: "",
      resources: "",
      experience: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ProgramProposalForm) => {
      const response = await apiRequest("POST", "/api/program-proposals", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Program Proposal Submitted",
        description: "We'll review your proposal and contact you soon!",
      });
      form.reset();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/program-proposals"] });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProgramProposalForm) => {
    submitMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Propose a Program
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Share your program idea with us. We're always looking for fresh content that serves Northern Uganda.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="proposerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proposerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="proposerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+256 700 000 000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your organization" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="programTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="What's your program called?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="programDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your program concept, format, goals, and how it will benefit the community..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 30 minutes, 1 hour" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., farmers, youth, families" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="proposedSchedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposed Schedule</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Weekly on Saturdays at 7 PM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resources"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resources Needed</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What equipment, studio time, or support would you need?"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Broadcasting Experience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your previous experience in media, broadcasting, or public speaking..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Proposal"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}