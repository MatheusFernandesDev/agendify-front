"use client";

import { Card, CardContent } from "@/components/ui/card";

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileCard({ children, className }: MobileCardProps) {
  return (
    <Card className={`mb-4 border border-gray-200 ${className || ""}`}>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}

