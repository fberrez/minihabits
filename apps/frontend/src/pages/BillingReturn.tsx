import { useEffect, useRef } from 'react';
import { useBilling } from '@/api/hooks/useBilling';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import JSConfetti from 'js-confetti';

export default function BillingReturn() {
  const { status, refreshStatus } = useBilling();
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const jsConfettiRef = useRef<JSConfetti | null>(null);
  const didShowConfettiRef = useRef<boolean>(false);

  useEffect(() => {
    if (status?.isPremium) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      refreshStatus();
    }, 1500);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [refreshStatus, status?.isPremium]);

  useEffect(() => {
    jsConfettiRef.current = new JSConfetti();
    return () => {
      jsConfettiRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (status?.isPremium && !didShowConfettiRef.current) {
      didShowConfettiRef.current = true;
      jsConfettiRef.current?.addConfetti({
        confettiColors: ['#22c55e', '#16a34a', '#3b82f6', '#fbbf24'],
        confettiNumber: 200,
      });
    }
  }, [status?.isPremium]);

  const isDone = status?.isPremium || status?.status === 'cancel_at_period_end';

  return (
    <div className="flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">
          {isDone ? 'All set!' : 'Processing your request…'}
        </h1>
        {isDone ? (
          <p>
            {status?.isPremium
              ? 'Your subscription is active. Enjoy Premium!'
              : 'Your subscription will be canceled at period end.'}
          </p>
        ) : (
          <p>
            We are confirming your payment with our provider. This usually takes
            a few seconds.
          </p>
        )}
        <div className="space-x-2">
          <Button onClick={() => navigate('/account')}>Go to Account</Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
