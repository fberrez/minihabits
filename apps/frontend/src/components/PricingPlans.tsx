import { useState } from 'react';
import { Check, Crown, Infinity, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useSubscription } from '../api/hooks/useSubscription';
import { SubscriptionPlan } from '../api/types/billing';
import { useToast } from '../hooks/use-toast';
import { Skeleton } from './ui/skeleton';

const planIcons = {
  [SubscriptionPlan.FREE]: null,
  [SubscriptionPlan.MONTHLY]: <Zap className="h-5 w-5" />,
  [SubscriptionPlan.YEARLY]: <Crown className="h-5 w-5" />,
  [SubscriptionPlan.LIFETIME]: <Infinity className="h-5 w-5" />,
};

const planFeatures = {
  [SubscriptionPlan.FREE]: [
    'Create up to 3 habits',
    'Basic habit tracking',
    'Simple statistics',
    'Mobile responsive',
  ],
  [SubscriptionPlan.MONTHLY]: [
    'Unlimited habits',
    'Advanced statistics',
    'Export data',
    'Priority support',
    'All future features',
  ],
  [SubscriptionPlan.YEARLY]: [
    'Unlimited habits',
    'Advanced statistics',
    'Export data',
    'Priority support',
    'All future features',
    'Best value - save 67%!',
  ],
  [SubscriptionPlan.LIFETIME]: [
    'Unlimited habits',
    'Advanced statistics',
    'Export data',
    'Priority support',
    'All future features',
    'One-time payment',
    'Lifetime updates',
  ],
};

export function PricingPlans() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const { 
    plans, 
    currentPlan, 
    isLoadingPlans, 
    createSubscription, 
    isCreatingSubscription,
    createSubscriptionError,
    getYearlySavings 
  } = useSubscription();
  const { toast } = useToast();

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (plan === SubscriptionPlan.FREE) {
      toast({
        title: "You're already on the free plan",
        description: "Choose a paid plan to unlock unlimited habits!",
      });
      return;
    }

    if (plan === currentPlan) {
      toast({
        title: "Already subscribed",
        description: `You're already on the ${plan.toLowerCase()} plan.`,
      });
      return;
    }

    setSelectedPlan(plan);
    
    try {
      await createSubscription(plan);
      // User will be redirected to Mollie checkout
    } catch (error) {
      console.error('Failed to create subscription:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSelectedPlan(null);
    }
  };

  const yearlySavings = getYearlySavings();

  if (isLoadingPlans) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="relative">
              <CardHeader>
                <Skeleton className="h-6 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
                <Skeleton className="h-10 w-full mt-6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start with our free plan and upgrade when you're ready to unlock unlimited habits and advanced features.
        </p>
      </div>

      {createSubscriptionError && (
        <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
          <p className="text-destructive">
            {createSubscriptionError.message}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = plan.plan === currentPlan;
          const isProcessing = selectedPlan === plan.plan && isCreatingSubscription;
          const features = planFeatures[plan.plan] || [];
          
          return (
            <Card 
              key={plan.plan} 
              className={`relative transition-all duration-200 hover:shadow-lg ${
                plan.isPopular 
                  ? 'border-primary shadow-md scale-105' 
                  : ''
              } ${
                isCurrentPlan 
                  ? 'bg-primary/5 border-primary' 
                  : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {yearlySavings > 0 && plan.plan === SubscriptionPlan.YEARLY && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 px-2 py-1">
                    Save {yearlySavings}%
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  {planIcons[plan.plan]}
                  <CardTitle className="ml-2 text-xl">
                    {plan.name}
                    {isCurrentPlan && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Current
                      </Badge>
                    )}
                  </CardTitle>
                </div>
                
                <div className="text-3xl font-bold">
                  {plan.formattedPrice}
                  {plan.interval && (
                    <span className="text-sm text-muted-foreground font-normal">
                      /{plan.interval === '1 month' ? 'month' : 'year'}
                    </span>
                  )}
                </div>
                
                <CardDescription className="min-h-[2.5rem] flex items-center justify-center">
                  {plan.habitLimit === -1 
                    ? 'Unlimited habits' 
                    : `Up to ${plan.habitLimit} habits`
                  }
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full"
                  variant={plan.isPopular ? "default" : "outline"}
                  disabled={isProcessing || (plan.plan === SubscriptionPlan.FREE)}
                  onClick={() => handleSelectPlan(plan.plan)}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : plan.plan === SubscriptionPlan.FREE ? (
                    'Free Forever'
                  ) : (
                    `Choose ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          All plans include a 30-day money-back guarantee. 
          You can cancel your subscription at any time.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Payments are processed securely through Mollie. 
          We support iDEAL, credit cards, and other European payment methods.
        </p>
      </div>
    </div>
  );
}