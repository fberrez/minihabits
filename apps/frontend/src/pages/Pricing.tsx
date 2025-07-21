import { useState, useEffect } from "react";
import { CheckIcon, SparklesIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { api } from "../api/generated";

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
}

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.billing.billingControllerGetPlans();
        setPlans(response as Plan[]);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = (planId: string) => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    setSelectedPlan(planId);
    navigate(`/payment?plan=${planId}`);
  };

  const formatPrice = (price: number, interval: string) => {
    if (interval === "one_off") {
      return `€${price.toFixed(2)}`;
    }
    return `€${price.toFixed(2)}/${interval === "monthly" ? "month" : "year"}`;
  };

  const getPopularPlan = () => {
    return plans.find(plan => plan.id === "yearly");
  };

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
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start building better habits today. Upgrade to unlock unlimited habits and premium features.
          </p>
        </div>

        {/* Free Tier Info */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Tier</h3>
            <p className="text-gray-600">
              You can create up to <strong>3 habits</strong> for free. Upgrade to create unlimited habits and access premium features.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isPopular = plan.id === "yearly";
            const isLifetime = plan.id === "lifetime";
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  isPopular ? "border-indigo-500 scale-105" : "border-gray-200"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <SparklesIcon className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(plan.price, plan.interval)}
                      </span>
                      {plan.interval !== "one_off" && (
                        <span className="text-gray-500 text-lg ml-1">
                          {plan.interval === "yearly" && (
                            <div className="text-sm text-green-600 font-medium">
                              Save 2 months!
                            </div>
                          )}
                        </span>
                      )}
                    </div>
                    {isLifetime && (
                      <div className="text-sm text-purple-600 font-medium">
                        One-time payment
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={selectedPlan === plan.id}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                      isPopular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : isLifetime
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    } ${selectedPlan === plan.id ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {selectedPlan === plan.id ? "Processing..." : `Get ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ or Additional Info */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h4>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                What happens to my data if I cancel?
              </h4>
              <p className="text-gray-600">
                Your data remains safe. You'll just be limited to 3 habits on the free tier, but all your existing data is preserved.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Is the lifetime plan really lifetime?
              </h4>
              <p className="text-gray-600">
                Yes! One payment gives you access to MiniHabits forever, including all future updates and features.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                How secure is my payment?
              </h4>
              <p className="text-gray-600">
                We use GoCardless for secure payment processing. Your payment information is encrypted and never stored on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Back to App */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate(isAuthenticated ? "/" : "/")}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to {isAuthenticated ? "Dashboard" : "Home"}
          </button>
        </div>
      </div>
    </div>
  );
}