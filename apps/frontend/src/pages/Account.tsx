import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CrownIcon, 
  CalendarIcon, 
  CreditCardIcon, 
  MailIcon,
  ShieldCheckIcon,
  ExternalLinkIcon 
} from "lucide-react";
import { api } from "../api/generated";

interface AccountState {
  showEmailDialog: boolean;
  showPasswordDialog: boolean;
  showDeleteDialog: boolean;
  showCancelSubscriptionDialog: boolean;
  isLoading: boolean;
  newEmail: string;
  currentPassword: string;
  newPassword: string;
}

interface UserData {
  email: string;
}

interface SubscriptionInfo {
  subscriptionTier: string;
  subscriptionStatus: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  habitLimit: number;
  canCreateHabits: boolean;
}

export default function Account() {
  const { signOut, authenticatedFetch } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [state, setState] = useState<AccountState>({
    showEmailDialog: false,
    showPasswordDialog: false,
    showDeleteDialog: false,
    showCancelSubscriptionDialog: false,
    isLoading: false,
    newEmail: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await authenticatedFetch(
          `${import.meta.env.VITE_API_BASE_URL}/users/me`
        );

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await userResponse.json();
        setUserData(userData);

        // Fetch subscription info
        try {
          const subscriptionData = await api.billing.billingControllerGetSubscriptionInfo();
          setSubscriptionInfo(subscriptionData);
        } catch (error) {
          console.error("Failed to fetch subscription info:", error);
          // Set default free tier if subscription fetch fails
          setSubscriptionInfo({
            subscriptionTier: 'free',
            subscriptionStatus: 'inactive',
            habitLimit: 3,
            canCreateHabits: true
          });
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchData();
  }, [authenticatedFetch, toast]);

  const resetState = () => {
    setState((prev) => ({
      ...prev,
      showEmailDialog: false,
      showPasswordDialog: false,
      showDeleteDialog: false,
      isLoading: false,
      newEmail: "",
      currentPassword: "",
      newPassword: "",
    }));
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/email`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newEmail: state.newEmail,
            password: state.currentPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update email");
      }

      const data = await response.json();
      setUserData(data);
      toast({
        title: "Email updated",
        description: "Your email has been successfully updated.",
      });
      resetState();
    } catch {
      toast({
        title: "Error",
        description:
          "Failed to update email. Please check your password and try again.",
        variant: "destructive",
      });
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: state.currentPassword,
            newPassword: state.newPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      resetState();
    } catch {
      toast({
        title: "Error",
        description:
          "Failed to update password. Please check your current password and try again.",
        variant: "destructive",
      });
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteAccount = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_BASE_URL}/users`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: state.currentPassword }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      await signOut();
      navigate("/auth");
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
    } catch {
      toast({
        title: "Error",
        description:
          "Failed to delete account. Please check your password and try again.",
        variant: "destructive",
      });
    } finally {
      resetState();
    }
  };

  const handleCancelSubscription = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      await api.billing.billingControllerCancelSubscription();
      
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully. You'll continue to have access until the end of your billing period.",
      });

      // Refresh subscription info
      const subscriptionData = await api.billing.billingControllerGetSubscriptionInfo();
      setSubscriptionInfo(subscriptionData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setState((prev) => ({ 
        ...prev, 
        isLoading: false, 
        showCancelSubscriptionDialog: false 
      }));
    }
  };

  const getTierDisplayName = (tier: string) => {
    const names = {
      free: "Free",
      monthly: "Monthly",
      yearly: "Yearly", 
      lifetime: "Lifetime"
    };
    return names[tier as keyof typeof names] || tier;
  };

  const getTierIcon = (tier: string) => {
    if (tier === 'free') return null;
    return <CrownIcon className="w-4 h-4 text-yellow-500" />;
  };

  const contactSupport = () => {
    window.open('mailto:support@minihabits.com?subject=Subscription Support Request', '_blank');
  };

  const renderEmailDialog = () => (
    <Dialog
      open={state.showEmailDialog}
      onOpenChange={(open) =>
        setState((prev) => ({ ...prev, showEmailDialog: open }))
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Email</DialogTitle>
          <DialogDescription>
            Enter your new email address and current password to confirm the
            change.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdateEmail}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-email">New Email</Label>
              <Input
                id="new-email"
                type="email"
                autoComplete="new-email"
                placeholder="new@example.com"
                value={state.newEmail}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, newEmail: e.target.value }))
                }
                disabled={state.isLoading}
                required
                tabIndex={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current-password-email">Current Password</Label>
              <Input
                id="current-password-email"
                type="password"
                autoComplete="current-password"
                value={state.currentPassword}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                disabled={state.isLoading}
                required
                tabIndex={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setState((prev) => ({ ...prev, showEmailDialog: false }))
              }
              disabled={state.isLoading}
              tabIndex={4}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={state.isLoading} tabIndex={3}>
              {state.isLoading ? "Updating..." : "Update Email"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  const renderPasswordDialog = () => (
    <Dialog
      open={state.showPasswordDialog}
      onOpenChange={(open) =>
        setState((prev) => ({ ...prev, showPasswordDialog: open }))
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdatePassword}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={state.currentPassword}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                disabled={state.isLoading}
                required
                tabIndex={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={state.newPassword}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                disabled={state.isLoading}
                required
                tabIndex={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setState((prev) => ({ ...prev, showPasswordDialog: false }))
              }
              disabled={state.isLoading}
              tabIndex={4}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={state.isLoading} tabIndex={3}>
              {state.isLoading ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  const renderDeleteDialog = () => (
    <AlertDialog
      open={state.showDeleteDialog}
      onOpenChange={(open) =>
        setState((prev) => ({ ...prev, showDeleteDialog: open }))
      }
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="delete-password">Confirm your password</Label>
            <Input
              id="delete-password"
              type="password"
              value={state.currentPassword}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              disabled={state.isLoading}
              required
              tabIndex={1}
              autoComplete="current-password"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={state.isLoading} tabIndex={3}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={state.isLoading || !state.currentPassword}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            tabIndex={2}
          >
            {state.isLoading ? "Deleting..." : "Delete Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const renderCancelSubscriptionDialog = () => (
    <AlertDialog
      open={state.showCancelSubscriptionDialog}
      onOpenChange={(open) =>
        setState((prev) => ({ ...prev, showCancelSubscriptionDialog: open }))
      }
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel your subscription? You'll continue to have access to premium features until the end of your current billing period.
            {subscriptionInfo?.subscriptionEndDate && (
              <span className="block mt-2 font-medium">
                Your access will continue until {new Date(subscriptionInfo.subscriptionEndDate).toLocaleDateString()}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={state.isLoading}>
            Keep Subscription
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancelSubscription}
            disabled={state.isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {state.isLoading ? "Cancelling..." : "Cancel Subscription"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (state.isLoading || isPageLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-full max-w-5xl p-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
              <div className="pt-6">
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-2xl p-4 space-y-6">
        {/* Subscription Management Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {subscriptionInfo && getTierIcon(subscriptionInfo.subscriptionTier)}
              Subscription Management
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {subscriptionInfo ? (
              <>
                {/* Current Plan */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTierIcon(subscriptionInfo.subscriptionTier)}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {getTierDisplayName(subscriptionInfo.subscriptionTier)} Plan
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Status: <span className="capitalize">{subscriptionInfo.subscriptionStatus}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {subscriptionInfo.habitLimit === 999999 ? "Unlimited" : subscriptionInfo.habitLimit} habits
                    </p>
                    {subscriptionInfo.subscriptionEndDate && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subscriptionInfo.subscriptionTier === 'lifetime' 
                          ? 'Forever' 
                          : `Until ${new Date(subscriptionInfo.subscriptionEndDate).toLocaleDateString()}`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subscription Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <CalendarIcon className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Started</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subscriptionInfo.subscriptionStartDate 
                          ? new Date(subscriptionInfo.subscriptionStartDate).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {subscriptionInfo.subscriptionStatus}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {subscriptionInfo.subscriptionTier === 'free' ? (
                    <Button 
                      onClick={() => navigate('/pricing')}
                      className="flex items-center gap-2"
                    >
                      <CrownIcon className="w-4 h-4" />
                      Upgrade Plan
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/pricing')}
                        className="flex items-center gap-2"
                      >
                        <CreditCardIcon className="w-4 h-4" />
                        Change Plan
                      </Button>
                      
                      {subscriptionInfo.subscriptionTier !== 'lifetime' && 
                       subscriptionInfo.subscriptionStatus === 'active' && (
                        <Button 
                          variant="destructive"
                          onClick={() => setState(prev => ({ ...prev, showCancelSubscriptionDialog: true }))}
                          disabled={state.isLoading}
                        >
                          Cancel Subscription
                        </Button>
                      )}
                    </>
                  )}
                  
                  <Button 
                    variant="outline"
                    onClick={contactSupport}
                    className="flex items-center gap-2"
                  >
                    <MailIcon className="w-4 h-4" />
                    Contact Support
                    <ExternalLinkIcon className="w-3 h-3" />
                  </Button>
                </div>

                {/* Support Info */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Need help?</strong> Our support team is here to assist you with any subscription questions or issues.
                    Email us at{" "}
                    <button 
                      onClick={contactSupport}
                      className="underline hover:no-underline"
                    >
                      support@minihabits.com
                    </button>
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="flex items-center gap-4">
                <Input
                  value={userData?.email || ""}
                  disabled
                  className="flex-1"
                  tabIndex={-1}
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    setState((prev) => ({ ...prev, showEmailDialog: true }))
                  }
                  disabled={state.isLoading}
                  tabIndex={1}
                >
                  Change
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="password"
                  value="••••••••"
                  disabled
                  className="flex-1"
                  tabIndex={-1}
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    setState((prev) => ({ ...prev, showPasswordDialog: true }))
                  }
                  disabled={state.isLoading}
                  tabIndex={2}
                >
                  Change
                </Button>
              </div>
            </div>

            <div className="pt-6">
              <Button
                variant="destructive"
                onClick={() =>
                  setState((prev) => ({ ...prev, showDeleteDialog: true }))
                }
                disabled={state.isLoading}
                tabIndex={3}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {renderEmailDialog()}
        {renderPasswordDialog()}
        {renderDeleteDialog()}
        {renderCancelSubscriptionDialog()}
      </div>
    </div>
  );
}
