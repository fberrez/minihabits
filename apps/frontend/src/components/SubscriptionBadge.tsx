import { CrownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionBadgeProps {
  tier: string;
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}

export function SubscriptionBadge({ 
  tier, 
  className, 
  showIcon = true, 
  showText = true 
}: SubscriptionBadgeProps) {
  if (tier === 'free') return null;

  const getBadgeStyles = (tier: string) => {
    switch (tier) {
      case 'monthly':
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
      case 'yearly':
        return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800";
      case 'lifetime':
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border-amber-200 dark:from-yellow-900/20 dark:to-amber-900/20 dark:text-amber-300 dark:border-amber-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const getTierDisplayName = (tier: string) => {
    const names = {
      monthly: "Pro",
      yearly: "Pro",
      lifetime: "Lifetime"
    };
    return names[tier as keyof typeof names] || tier;
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border",
        getBadgeStyles(tier),
        className
      )}
    >
      {showIcon && <CrownIcon className="w-3 h-3" />}
      {showText && getTierDisplayName(tier)}
    </span>
  );
}