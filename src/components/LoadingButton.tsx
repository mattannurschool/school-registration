// src/components/LoadingButton.tsx
import React from "react";

interface LoadingButtonProps {
  isLoading: boolean;
  onClick: () => void;
  title: React.ReactNode;
  className: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  onClick,
  title,
  className,
}) => {
  return (
    <button
      style={{ width: 150 }}
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <div className="">
          <span className="flex flex-1 justify-center">
            <span className="dot animate-ping"></span>
            <span className="dot animate-ping"></span>
            <span className="dot animate-ping"></span>
          </span>
        </div>
      ) : (
        title
      )}
    </button>
  );
};

export default LoadingButton;
