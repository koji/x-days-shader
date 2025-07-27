import React from 'react';
import { useFPS } from '../hooks/use-fps';
import { Badge } from './ui/badge';
import { AlertTriangle, Zap, Info } from 'lucide-react';

interface PerformanceMonitorProps {
  className?: string;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ className = '' }) => {
  const fps = useFPS();

  const getPerformanceStatus = () => {
    if (fps >= 55) return { status: 'excellent', color: 'bg-green-500', icon: <Zap className="w-3 h-3" /> };
    if (fps >= 30) return { status: 'good', color: 'bg-yellow-500', icon: <Info className="w-3 h-3" /> };
    return { status: 'poor', color: 'bg-red-500', icon: <AlertTriangle className="w-3 h-3" /> };
  };

  const { status, color, icon } = getPerformanceStatus();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant="outline" className="text-xs">
        {icon}
        <span className="ml-1">FPS: {fps}</span>
      </Badge>
      <Badge variant="outline" className={`text-xs ${color} text-white`}>
        {status}
      </Badge>
    </div>
  );
}; 
