import { useQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';

interface LiveViewerCountProps {
  streamType: 'tv' | 'radio';
  className?: string;
}

export default function LiveViewerCount({ streamType, className = '' }: LiveViewerCountProps) {
  const { data: viewerCount = 0 } = useQuery({
    queryKey: ['/api/active-users/count', streamType],
    queryFn: async () => {
      const response = await fetch(`/api/active-users/count/${streamType}`);
      if (!response.ok) throw new Error('Failed to fetch viewer count');
      const data = await response.json();
      // Ensure we return a number, not an object
      return typeof data.count === 'number' ? data.count : 0;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
    staleTime: 5000, // Consider data stale after 5 seconds
  });

  // Ensure viewerCount is always a number
  const count = typeof viewerCount === 'number' ? viewerCount : 0;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded-full text-sm font-medium">
        <Eye className="w-4 h-4" />
        <span>{count.toLocaleString()}</span>
        <span>{streamType === 'tv' ? 'viewers' : 'listeners'}</span>
      </div>
    </div>
  );
}