import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  premium?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  premium = false,
}) => {
  const baseClasses = premium
    ? 'glass-card-premium rounded-2xl p-6'
    : 'glass-panel rounded-2xl p-6';

  const hoverClasses = hoverEffect ? 'glass-panel-hover cursor-pointer' : '';

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};
