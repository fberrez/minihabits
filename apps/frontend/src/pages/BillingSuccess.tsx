import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useSubscription } from '../api/hooks/useSubscription';
import { useToast } from '../hooks/use-toast';

export function BillingSuccess() {
  const navigate = useNavigate();
  const { refetchLimits, currentPlan } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    // Refetch subscription data when component mounts
    refetchLimits();
    
    // Show success toast
    toast({
      title: "Payment Successful!",
      description: "Your subscription has been activated. You can now create unlimited habits!",
    });
  }, [refetchLimits, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-900">Payment Successful!</CardTitle>
          <CardDescription className="text-green-700">
            Welcome to MiniHabits {currentPlan?.toLowerCase()} plan! Your subscription is now active.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4 border border-green-200">
            <h3 className="font-medium text-green-900 mb-2">What's next?</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Create unlimited habits</li>
              <li>• Access advanced statistics</li>
              <li>• Export your data</li>
              <li>• Get priority support</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
            <Button 
              onClick={() => navigate('/settings')} 
              variant="outline" 
              className="w-full"
            >
              <Settings className="mr-2 h-4 w-4" />
              Manage Subscription
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Thank you for supporting MiniHabits! 🎉
          </p>
        </CardContent>
      </Card>
    </div>
  );
}