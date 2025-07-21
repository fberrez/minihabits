import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CreditCardIcon, ShieldCheckIcon, ArrowLeftIcon } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import { api } from "../api/generated";

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  
  const planId = searchParams.get("plan");
  const flowId = searchParams.get("redirect_flow_id");
  const sessionToken = searchParams.get("session_token");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    if (flowId && sessionToken && planId) {
      // User is returning from GoCardless, complete the subscription
      completeSubscription();
    } else if (planId) {
      // Load plan details for initial payment setup
      fetchPlanDetails();
    }
  }, [isAuthenticated, planId, flowId, sessionToken]);

  const fetchPlanDetails = async () => {
    try {
      const plans = await api.billing.billingControllerGetPlans();
      const plan = plans.find((p: any) => p.id === planId);
      setSelectedPlan(plan);
    } catch (error) {
      console.error("Failed to fetch plan:", error);
      setError("Failed to load plan details. Please try again.");
    }
  };

  const initiatePayment = async () => {
    if (!planId || !selectedPlan) return;

    setLoading(true);
    setError("");

    try {
      const successUrl = `${window.location.origin}/payment?plan=${planId}`;
      
      const response = await api.billing.billingControllerCreateSubscription({
        planId,
        successRedirectUrl: successUrl,
      });

      // Redirect to GoCardless payment page
      window.location.href = response.redirectUrl;
    } catch (error: any) {
      console.error("Payment initiation failed:", error);
      setError(error.message || "Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  };

  const completeSubscription = async () => {
    if (!flowId || !sessionToken || !planId) return;

    setLoading(true);
    setError("");

    try {
      await api.billing.billingControllerCompleteSubscription({
        flowId,
        sessionToken,
        planId,
      });

      // Redirect to success page or dashboard
      navigate("/payment/success");
    } catch (error: any) {
      console.error("Subscription completion failed:", error);
      setError(error.message || "Failed to complete subscription. Please contact support.");
      setLoading(false);
    }
  };

  const formatPrice = (price: number, interval: string) => {
    if (interval === "one_off") {
      return `€${price.toFixed(2)}`;
    }
    return `€${price.toFixed(2)}/${interval === "monthly" ? "month" : "year"}`;
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (flowId && sessionToken) {
    // Returning from GoCardless
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing Your Subscription
            </h2>
            <p className="text-gray-600">
              Please wait while we process your payment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate("/pricing")}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Pricing
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Your Purchase
            </h1>
            <p className="text-gray-600">
              You're about to subscribe to the {selectedPlan.name}
            </p>
          </div>

          {/* Plan Summary */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h2>
            </div>
            
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedPlan.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {selectedPlan.interval === "one_off" 
                      ? "One-time payment" 
                      : `Billed ${selectedPlan.interval}`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    {formatPrice(selectedPlan.price, selectedPlan.interval)}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <h4 className="font-medium text-gray-900">What's included:</h4>
              <ul className="space-y-1">
                {selectedPlan.features.map((feature: string, index: number) => (
                  <li key={index} className="text-gray-600 text-sm flex items-center">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
              <span>Total</span>
              <span>{formatPrice(selectedPlan.price, selectedPlan.interval)}</span>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="w-6 h-6 text-green-500 mr-3" />
              <h3 className="font-semibold text-gray-900">Secure Payment</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Your payment is processed securely by GoCardless. We never store your payment information.
              You'll be redirected to GoCardless to complete your payment.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Payment Button */}
          <div className="text-center">
            <button
              onClick={initiatePayment}
              disabled={loading}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              ) : (
                <CreditCardIcon className="w-5 h-5 mr-3" />
              )}
              {loading ? "Processing..." : "Continue to Payment"}
            </button>
            
            <p className="text-gray-500 text-xs mt-4">
              By continuing, you agree to our{" "}
              <a href="/terms-of-use" className="text-indigo-600 hover:text-indigo-800">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-indigo-600 hover:text-indigo-800">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}