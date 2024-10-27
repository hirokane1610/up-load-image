import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="border-b pb-2 mb-2">{children}</div>;
};

export const CardTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <h2 className="text-lg font-semibold">{children}</h2>;
};

export const CardContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="mt-2">{children}</div>;
};
