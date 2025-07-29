import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Play, Calendar } from 'lucide-react';

interface Program {
  id: string;
  time: string;
  title: string;
  description: string;
  category: string;
  isLive: boolean;
  isNext: boolean;
  hasVOD: boolean;
}

const tvPrograms: Program[] = [
  {
    id: '1',
    time: '13:00',
    title: 'Northern Pulse',
    description: 'Daily news and current affairs from Northern Uganda',
    category: 'News',
    isLive: true,
    isNext: false,
    hasVOD: true
  },
  {
    id: '2',
    time: '14:00',
    title: 'Village Voices',
    description: 'Community stories and local perspectives',
    category: 'Magazine',
    isLive: false,
    isNext: true,
    hasVOD: true
  },
  {
    id: '3',
    time: '15:00',
    title: 'AgriFront',
    description: 'Agricultural insights and farming techniques',
    category: 'Agriculture',
    isLive: false,
    isNext: false,
    hasVOD: false
  },
  {
    id: '4',
    time: '16:00',
    title: 'Youth Spotlight',
    description: 'Empowering young voices across the region',
    category: 'Youth',
    isLive: false,
    isNext: false,
    hasVOD: true
  }
];

const radioPrograms: Program[] = [
  {
    id: '5',
    time: '13:00',
    title: 'Midday Mix',
    description: 'The funkiest music selection to brighten your afternoon',
    category: 'Music',
    isLive: true,
    isNext: false,
    hasVOD: false
  },
  {
    id: '6',
    time: '14:00',
    title: 'Talk Back Lira',
    description: 'Interactive talk show with live call-ins',
    category: 'Talk',
    isLive: false,
    isNext: true,
    hasVOD: false
  },
  {
    id: '7',
    time: '15:00',
    title: 'Luo Beats',
    description: 'Traditional and contemporary Luo music',
    category: 'Music',
    isLive: false,
    isNext: false,
    hasVOD: false
  },
  {
    id: '8',
    time: '16:00',
    title: 'Drive Time',
    description: 'High-energy music for your commute home',
    category: 'Music',
    isLive: false,
    isNext: false,
    hasVOD: false
  }
];

interface ProgramGuideProps {
  activeTab: 'tv' | 'radio';
}

export default function ProgramGuide({ activeTab }: ProgramGuideProps) {
  const programs = activeTab === 'tv' ? tvPrograms : radioPrograms;
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'News': 'bg-red-100 text-red-800',
      'Magazine': 'bg-blue-100 text-blue-800',
      'Agriculture': 'bg-green-100 text-green-800',
      'Youth': 'bg-purple-100 text-purple-800',
      'Music': 'bg-yellow-100 text-yellow-800',
      'Talk': 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          {activeTab === 'tv' ? 'TV Schedule' : 'Radio Schedule'}
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Today, {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-3">
        {programs.map((program) => (
          <div
            key={program.id}
            className={`p-4 rounded-lg border transition-all ${
              program.isLive
                ? 'bg-red-50 border-red-200 shadow-md'
                : program.isNext
                ? 'bg-blue-50 border-blue-200'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{program.time}</span>
                  </div>
                  
                  {program.isLive && (
                    <Badge className="bg-red-600 text-white text-xs">
                      <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
                      LIVE NOW
                    </Badge>
                  )}
                  
                  {program.isNext && (
                    <Badge className="bg-blue-600 text-white text-xs">
                      UP NEXT
                    </Badge>
                  )}
                  
                  <Badge className={`text-xs ${getCategoryColor(program.category)}`}>
                    {program.category}
                  </Badge>
                </div>
                
                <h4 className="font-semibold text-lg text-gray-900 mb-1">
                  {program.title}
                </h4>
                
                <p className="text-gray-600 text-sm mb-3">
                  {program.description}
                </p>
                
                <div className="flex items-center space-x-2">
                  {program.hasVOD && (
                    <span className="text-xs text-green-600 font-medium">
                      • Available on demand
                    </span>
                  )}
                </div>
              </div>
              
              <div className="ml-4">
                {program.isLive ? (
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                    <Play className="h-3 w-3 mr-1" />
                    Watch Now
                  </Button>
                ) : program.hasVOD ? (
                  <Button size="sm" variant="outline">
                    <Play className="h-3 w-3 mr-1" />
                    Watch
                  </Button>
                ) : (
                  <div className="text-xs text-gray-500 text-center">
                    Upcoming
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-600">1</div>
            <div className="text-xs text-gray-600">Live Now</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">1</div>
            <div className="text-xs text-gray-600">Up Next</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {programs.filter(p => p.hasVOD).length}
            </div>
            <div className="text-xs text-gray-600">On Demand</div>
          </div>
        </div>
      </div>
    </Card>
  );
}