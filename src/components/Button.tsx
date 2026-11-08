import React from 'react';

export default function Button({ className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={`trade-button ${className}`} {...props} />;
}