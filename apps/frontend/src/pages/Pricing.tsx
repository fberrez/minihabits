import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBilling } from '@/api/hooks/useBilling';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, X } from 'lucide-react';
type Column = 'free' | 'monthly' | 'yearly' | 'lifetime';

export default function Pricing() {
  const { plans, isLoadingPlans, createCheckout } = useBilling();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Column | null>(null);

  const planMap = useMemo(() => {
    const byInterval: Partial<
      Record<Column, { code: string; name: string; priceCents: number }>
    > = {};
    for (const p of plans) {
      if (p.code === 'free')
        byInterval.free = {
          code: p.code,
          name: p.name,
          priceCents: p.priceCents,
        };
      if (p.interval === 'month')
        byInterval.monthly = {
          code: p.code,
          name: p.name,
          priceCents: p.priceCents,
        };
      if (p.interval === 'year')
        byInterval.yearly = {
          code: p.code,
          name: p.name,
          priceCents: p.priceCents,
        };
      if (p.interval === 'lifetime' && p.code !== 'free')
        byInterval.lifetime = {
          code: p.code,
          name: p.name,
          priceCents: p.priceCents,
        };
    }
    return byInterval;
  }, [plans]);

  const onContinue = async () => {
    if (!selected) return;
    const chosen = planMap[selected];
    if (!chosen) return;
    if (!isAuthenticated) {
      navigate('/auth?next=/pricing');
      return;
    }
    const { checkoutUrl } = await createCheckout(chosen.code);
    window.location.href = checkoutUrl;
  };

  const currency = '€';
  const highlightColumn = useMemo(() => {
    if (!selected) return undefined as number | undefined;
    return selected === 'free'
      ? 1
      : selected === 'monthly'
      ? 2
      : selected === 'yearly'
      ? 3
      : 4;
  }, [selected]);

  return (
    <div className="px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Choose your plan
          </h1>
          <p className="text-muted-foreground mt-2">
            Free forever up to 3 habits. Upgrade anytime. Cancel at period end
            for subscriptions.
          </p>
        </div>

        {isLoadingPlans ? (
          <div>Loading pricing…</div>
        ) : (
          <div className="rounded-xl border overflow-x-auto">
            <div className="grid grid-cols-5 min-w-[720px] bg-muted/30">
              <div className="p-4"></div>
              <PlanHeader
                title="Free"
                price={0}
                interval="up to 3 habits"
                selected={false}
                onSelect={() => setSelected(null)}
                muted
              />
              <PlanHeader
                title="Monthly"
                price={planMap.monthly?.priceCents}
                interval="/mo"
                selected={selected === 'monthly'}
                onSelect={() => setSelected('monthly')}
              />
              <PlanHeader
                title="Yearly"
                badge="Best value"
                price={planMap.yearly?.priceCents}
                interval="/yr"
                selected={selected === 'yearly'}
                onSelect={() => setSelected('yearly')}
              />
              <PlanHeader
                title="Lifetime"
                icon
                price={planMap.lifetime?.priceCents}
                interval="one-time"
                selected={selected === 'lifetime'}
                onSelect={() => setSelected('lifetime')}
              />
            </div>

            <FeatureRow
              label="Unlimited habits"
              highlightColumn={highlightColumn}
            >
              <Text>Up to 3</Text>
              <Yes />
              <Yes />
              <Yes />
            </FeatureRow>

            <FeatureRow
              label="Advanced stats & heatmaps"
              highlightColumn={highlightColumn}
            >
              <Yes />
              <Yes />
              <Yes />
              <Yes />
            </FeatureRow>

            <FeatureRow
              label="Yearly overview"
              highlightColumn={highlightColumn}
            >
              <Yes />
              <Yes />
              <Yes />
              <Yes />
            </FeatureRow>

            <FeatureRow
              label="Priority support"
              highlightColumn={highlightColumn}
            >
              <No />
              <Yes />
              <Yes />
              <Yes />
            </FeatureRow>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Button size="lg" disabled={!selected} onClick={onContinue}>
            Continue
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground mt-4">
          Prices shown include taxes where applicable. {currency}
          {(planMap.monthly?.priceCents ?? 0) / 100} billed monthly, {currency}
          {(planMap.yearly?.priceCents ?? 0) / 100} billed yearly, or one-time{' '}
          {currency}
          {(planMap.lifetime?.priceCents ?? 0) / 100} for lifetime access.
        </div>
      </div>
    </div>
  );
}

function PlanHeader(props: {
  title: string;
  price?: number;
  interval: string;
  selected: boolean;
  onSelect: () => void;
  badge?: string;
  icon?: boolean;
  muted?: boolean;
}) {
  const { title, price, interval, selected, onSelect, badge, icon, muted } =
    props;
  return (
    <div
      className={
        'p-4 border-l relative flex flex-col min-h-48 transition-all duration-200 ' +
        (selected
          ? 'bg-primary/5 ring-2 ring-primary/60 shadow-[0_0_24px_rgba(59,130,246,0.25)] z-10'
          : 'bg-transparent hover:bg-muted/20')
      }
    >
      <div className="text-sm font-medium mb-1 flex items-center justify-center gap-1">
        {icon && <Crown className="h-4 w-4 text-yellow-500" />}
        {title}
      </div>
      <div className="mb-2 h-5 flex items-center justify-center">
        {badge ? (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="text-2xl font-bold text-center">
        {typeof price === 'number' ? `€${(price / 100).toFixed(2)}` : '—'}
      </div>
      <div className="text-xs text-muted-foreground text-center min-h-4">
        {interval}
      </div>
      <div className="mt-auto pt-3 flex justify-center">
        {muted ? (
          <Button variant="outline" size="sm" disabled>
            Included
          </Button>
        ) : (
          <Button
            variant={selected ? 'default' : 'outline'}
            size="sm"
            onClick={onSelect}
          >
            {selected ? 'Selected' : 'Select'}
          </Button>
        )}
      </div>
    </div>
  );
}

function FeatureRow({
  label,
  children,
  highlightColumn,
}: {
  label: string;
  children: React.ReactNode;
  highlightColumn?: number;
}) {
  return (
    <div className="grid grid-cols-5 min-w-[720px] border-t">
      <div className="p-4 text-sm">{label}</div>
      <div
        className={
          'p-4 flex items-center justify-center border-l ' +
          (highlightColumn === 1 ? 'bg-primary/5' : '')
        }
      >
        {children instanceof Array ? children[0] : children}
      </div>
      <div
        className={
          'p-4 flex items-center justify-center border-l ' +
          (highlightColumn === 2 ? 'bg-primary/5' : '')
        }
      >
        {children instanceof Array ? children[1] : null}
      </div>
      <div
        className={
          'p-4 flex items-center justify-center border-l ' +
          (highlightColumn === 3 ? 'bg-primary/5' : '')
        }
      >
        {children instanceof Array ? children[2] : null}
      </div>
      <div
        className={
          'p-4 flex items-center justify-center border-l ' +
          (highlightColumn === 4 ? 'bg-primary/5' : '')
        }
      >
        {children instanceof Array ? children[3] : null}
      </div>
    </div>
  );
}

function Yes() {
  return <Check className="h-4 w-4 text-green-600" />;
}

function No() {
  return <X className="h-4 w-4 text-muted-foreground text-red-500" />;
}

function Text({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-muted-foreground">{children}</span>;
}
