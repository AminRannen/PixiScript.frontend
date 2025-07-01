import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ButtonProps {
  type?: "button" | "submit";
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const SecondaryButton = ({
  type = "button",
  children,
  onClick,
  className = ""
}: ButtonProps) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      className={`w-full py-6 bg-green-700  text-lg font-semibold mb-4 ${className}`}
      variant="default" // ShadCN's primary style
    >
      {children}
    </Button>
  );
};