import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 border rounded 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-transparent transition`}
    />
  );
};
