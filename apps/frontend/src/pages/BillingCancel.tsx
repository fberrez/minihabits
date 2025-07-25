import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function BillingCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-900">Payment Cancelled</CardTitle>
          <CardDescription className="text-red-700">
            No worries! Your payment was cancelled and no charges were made.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-orange-50 p-4 border border-orange-200">
            <h3 className="font-medium text-orange-900 mb-2">Still interested in upgrading?</h3>
            <p className="text-sm text-orange-800">
              You can always upgrade later to unlock unlimited habits and advanced features. 
              Your free plan includes up to 3 habits to get you started!
            </p>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button 
              onClick={() => navigate('/pricing')} 
              variant="outline" 
              className="w-full"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              View Pricing Plans
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Questions? Contact us at support@minihabits.app
          </p>
        </CardContent>
      </Card>
    </div>
  );
}