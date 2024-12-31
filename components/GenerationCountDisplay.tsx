"use client";

import { Button } from "@/components/ui/button";

interface GenerationCountDisplayProps {
  paid: boolean;
  generationsLeft: number;
  onUpgrade: () => void;
  className?: string;
}

export const GenerationCountDisplay = ({
  paid,
  generationsLeft,
  onUpgrade,
  className
}: GenerationCountDisplayProps) => {
  return (
    <div className={`font-semibold ${className}`}>
      {paid ? (
        <p className="text-sm"></p>
      ) : (
        <div className="flex items-center gap-2">
          <p className="text-sm">
            {generationsLeft} generations left
          </p>
          <Button
            variant="link"
            className="p-0 h-auto text-sm text-primary hover:underline"
            onClick={onUpgrade}
          >
            Upgrade
          </Button>
        </div>
      )}
    </div>
  );
};
