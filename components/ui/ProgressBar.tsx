import React from 'react';
import clsx from 'clsx';

interface ProgressBarProps {
  percentage: number | null;
  className?: string;
}

export default function ProgressBar({ percentage, className }: ProgressBarProps) {
  if (percentage === null) {
    return (
      <div className={clsx('w-full bg-gray-200 rounded-full h-3', className)}>
        <div className="bg-gray-400 h-3 rounded-full" style={{ width: '0%' }} />
      </div>
    );
  }

  const cappedPercentage = Math.min(percentage, 100);
  
  const getColor = () => {
    if (percentage > 100) return 'bg-danger';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className={clsx('w-full bg-gray-200 rounded-full h-3', className)}>
      <div
        className={clsx('h-3 rounded-full transition-all', getColor())}
        style={{ width: `${cappedPercentage}%` }}
      />
    </div>
  );
}
