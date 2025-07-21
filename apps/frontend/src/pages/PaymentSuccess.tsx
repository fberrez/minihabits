import { useEffect, useState } from "react";
import { CheckCircleIcon, SparklesIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { api } from "../api/generated";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    fetchSubscriptionInfo();
  }, [isAuthenticated]);

  const fetchSubscriptionInfo = async () => {
    try {
      const info = await api.billing.billingControllerGetSubscriptionInfo();
      setSubscriptionInfo(info);
    } catch (error) {
      console.error("Failed to fetch subscription info:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTierDisplayName = (tier: string) => {
    const names = {
      monthly: "Monthly",
      yearly: "Yearly", 
      lifetime: "Lifetime",
      free: "Free"
    };
    return names[tier as keyof typeof names] || tier;
  };

  const getTierFeatures = (tier: string) => {
    if (tier === "free") {
      return ["Up to 3 habits", "Basic statistics"];
    }
    return [
      "Unlimited habits",
      "Advanced statistics",
      "Data export",
      "Premium support"
    ];
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-green-100 rounded-full p-6">
              <CheckCircleIcon className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Welcome to your {getTierDisplayName(subscriptionInfo?.subscriptionTier)} plan!
            You now have access to all premium features.
          </p>

          {/* Subscription Details */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center justify-center mb-6">
              <SparklesIcon className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Your {getTierDisplayName(subscriptionInfo?.subscriptionTier)} Plan
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Plan Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-medium">
                      {getTierDisplayName(subscriptionInfo?.subscriptionTier)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium text-green-600">
                      {subscriptionInfo?.subscriptionStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Habit Limit:</span>
                    <span className="font-medium">
                      {subscriptionInfo?.habitLimit === 999999 ? "Unlimited" : subscriptionInfo?.habitLimit}
                    </span>
                  </div>
                  {subscriptionInfo?.subscriptionEndDate && (
                    <div className="flex justify-between">
                      <span>Next Billing:</span>
                      <span className="font-medium">
                        {new Date(subscriptionInfo.subscriptionEndDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">What's Included</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {getTierFeatures(subscriptionInfo?.subscriptionTier).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              What's Next?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-600 font-bold">1</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Create Habits</h4>
                <p className="text-sm text-gray-600">
                  You can now create unlimited habits to track your progress.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-600 font-bold">2</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Track Progress</h4>
                <p className="text-sm text-gray-600">
                  Use advanced statistics to monitor your habit-building journey.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-600 font-bold">3</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Export Data</h4>
                <p className="text-sm text-gray-600">
                  Download your data anytime to keep your progress safe.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200"
            >
              Start Building Habits
            </button>
            
            <button
              onClick={() => navigate("/account")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-6 rounded-lg transition-all duration-200"
            >
              Manage Subscription
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-sm">
              Need help getting started?{" "}
              <a href="mailto:support@minihabits.com" className="text-indigo-600 hover:text-indigo-800">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}