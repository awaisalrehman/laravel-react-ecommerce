import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageCellProps {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
}

const ImageCell: React.FC<ImageCellProps> = ({
  src,
  alt = 'Image',
  size = 48,
  className = '',
}) => {
  const [isError, setIsError] = useState(false);

  const imagePath =
    src && typeof src === 'string' && src.trim() !== ''
      ? src.startsWith('http')
        ? src
        : `/${src.replace(/^\/+/, '')}`
      : '/images/placeholder.png';

  return (
    <figure
      className={`rounded-lg border overflow-hidden flex items-center justify-center bg-gray-50`}
      style={{ width: size, height: size }}
    >
      {!isError ? (
        <img
          src={imagePath}
          alt={alt}
          loading="lazy"
          width={size}
          height={size}
          className={`object-cover w-full h-full ${className}`}
          onError={() => setIsError(true)}
        />
      ) : (
        <ImageIcon className="h-5 w-5 text-gray-400" />
      )}
    </figure>
  );
};

export default ImageCell;
