import { Badge } from "@/components/ui/badge";
import { PickResult } from "@/types";
import { RESULT_STYLES } from "@/lib/utils";

interface ResultBadgeProps {
  result: PickResult;
  className?: string;
}

export function ResultBadge({ result, className }: ResultBadgeProps) {
  const style = RESULT_STYLES[result];

  return (
    <Badge className={`${style.bg} ${style.text} border-0 ${className || ""}`}>
      {style.label}
    </Badge>
  );
}
