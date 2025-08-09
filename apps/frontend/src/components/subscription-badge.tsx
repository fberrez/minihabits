import { cn } from '@/lib/utils';

type Props = { planCode?: string };

export function SubscriptionBadge({ planCode }: Props) {
  const { label, color } = getBadge(planCode);
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        color,
      )}
    >
      {label}
    </span>
  );
}

function getBadge(planCode?: string) {
  switch (planCode) {
    case 'premium-monthly':
      return {
        label: 'Premium',
        color:
          'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200',
      };
    case 'premium-yearly':
      return {
        label: 'Premium',
        color:
          'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200',
      };
    case 'premium-lifetime':
      return {
        label: 'Premium',
        color:
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200',
      };
    default:
      return {
        label: 'Free',
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      };
  }
}

