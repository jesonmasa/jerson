import React from 'react';

export default function LoadingSpinner({ size = 'md', message }) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            <div className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
            {message && (
                <p className="text-gray-600 text-sm font-medium animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );
}
