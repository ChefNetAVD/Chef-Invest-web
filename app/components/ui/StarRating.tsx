import React from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'extrasmall' | 'small' | 'standard' | 'big';
  showNumber?: boolean;
  showReviews?: boolean;
  reviewCount?: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'standard',
  showNumber = false,
  showReviews = false,
  reviewCount,
  className = ''
}) => {
  const sizeClasses = {
    extrasmall: 'w-3 h-3',
    small: 'w-4 h-4',
    standard: 'w-5 h-5',
    big: 'w-6 h-6'
  };

  const textSizeClasses = {
    extrasmall: 'text-xs',
    small: 'text-sm',
    standard: 'text-base',
    big: 'text-lg'
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const fillPercentage = Math.max(0, Math.min(100, (rating - index) * 100));
    
    if (fillPercentage === 0) {
      return (
        <svg
          key={index}
          className={`${sizeClasses[size]} text-gray-300`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else if (fillPercentage === 100) {
      return (
        <svg
          key={index}
          className={`${sizeClasses[size]} text-green-500`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else {
      return (
        <div key={index} className="relative inline-block">
          {/* Empty star background */}
          <svg
            className={`${sizeClasses[size]} text-gray-300 absolute`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {/* Filled star overlay */}
          <div
            className="overflow-hidden"
            style={{ width: `${fillPercentage}%` }}
          >
            <svg
              className={`${sizeClasses[size]} text-green-500`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex">
        {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
      </div>
      
      {showNumber && (
        <span className={`${textSizeClasses[size]} text-gray-700 font-medium`}>
          {rating.toFixed(1)}
        </span>
      )}
      
      {showReviews && reviewCount && (
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          <span className={`${textSizeClasses[size]} text-gray-500`}>
            {reviewCount} reviews
          </span>
        </div>
      )}
    </div>
  );
}; 