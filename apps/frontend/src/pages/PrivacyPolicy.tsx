import { FeedbackButton } from "@/components/feedback-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="container py-6">
        <div className="w-full max-w-4xl mx-auto">
          <Card className="text-left">
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              <CardDescription>Last updated: March 9, 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2">Introduction</h2>
                <p>
                  This Privacy Policy explains how minihabits ("we", "us", or
                  "our") collects, uses, and protects your personal information
                  when you use our habit tracking application.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  Information We Collect
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Email address (for account creation and communication)
                  </li>
                  <li>
                    Habit tracking data (habits created and their completion
                    status)
                  </li>
                  <li>
                    Basic analytics data through Plausible Analytics
                    (privacy-focused analytics service based in the EU)
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  How We Use Your Information
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and maintain our service</li>
                  <li>
                    To communicate with you about your account (welcome emails,
                    password resets, email changes, account deletion,
                    newsletter)
                  </li>
                  <li>
                    To analyze usage patterns and improve our service through
                    privacy-focused analytics
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  Data Storage and Security
                </h2>
                <p>
                  Your data is stored on secure servers located in the European
                  Union through our hosting provider, OVH and MongoDB Atlas. We
                  implement appropriate security measures to protect your
                  personal information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  Third-Party Services
                </h2>
                <p>
                  We use Plausible Analytics, a privacy-focused analytics
                  service based in the EU, to collect anonymous usage
                  statistics. We do not share your personal information with any
                  other third parties.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Age Requirements</h2>
                <p>
                  Users must meet the minimum age requirement for having an
                  online account in their respective countries to use our
                  service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Export your data</li>
                  <li>Object to our processing of your data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  Changes to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please
                  contact us:
                </p>
                <FeedbackButton />
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
