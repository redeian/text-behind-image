"use client";

import { Button } from "@/components/ui/button";

interface ImageActionButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
}

export const ImageActionButton = ({
  onClick,
  label,
  className
}: ImageActionButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      className={className}
    >
      {label}
    </Button>
  );
};
