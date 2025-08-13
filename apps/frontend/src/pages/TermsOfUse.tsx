import { FeedbackButton } from '@/components/feedback-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function TermsOfUse() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="container py-6">
        <div className="w-full max-w-4xl mx-auto">
          <Card className="text-left">
            <CardHeader>
              <CardTitle>Terms of Use</CardTitle>
              <CardDescription>Last updated: August 13, 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2">
                  Acceptance of Terms
                </h2>
                <p>
                  By accessing or using minihabits, you agree to be bound by
                  these Terms of Use. If you do not agree to these terms, please
                  do not use our service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  Description of Service
                </h2>
                <p>
                  minihabits is a minimalist habit tracking application that
                  allows users to create, track, and maintain daily habits. The
                  service includes features such as:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Habit creation and tracking</li>
                  <li>Streak counting</li>
                  <li>Statistics and progress monitoring</li>
                  <li>Dark/Light mode support</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Hosting</h2>
                <p>
                  The application servers and database are hosted on Railway
                  (railway.app) in European Union regions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">User Accounts</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    You must meet the minimum age requirement for having an
                    online account in your country to use our service
                  </li>
                  <li>
                    You are responsible for maintaining the confidentiality of
                    your account credentials
                  </li>
                  <li>
                    You agree to provide accurate and complete information when
                    creating your account
                  </li>
                  <li>
                    You are responsible for all activities that occur under your
                    account
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Acceptable Use</h2>
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the service for any unlawful purpose</li>
                  <li>
                    Attempt to gain unauthorized access to the service or its
                    systems
                  </li>
                  <li>Interfere with or disrupt the service or servers</li>
                  <li>Create multiple accounts for abusive purposes</li>
                  <li>Share your account credentials with others</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  Intellectual Property
                </h2>
                <p>
                  The service and its original content, features, and
                  functionality are owned by minihabits and are protected by
                  international copyright, trademark, and other intellectual
                  property laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Termination</h2>
                <p>
                  We reserve the right to terminate or suspend your account and
                  access to the service at our sole discretion, without notice,
                  for conduct that we believe violates these Terms of Use or is
                  harmful to other users of the service, us, or third parties,
                  or for any other reason.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  Disclaimer of Warranties
                </h2>
                <p>
                  The service is provided "as is" and "as available" without any
                  warranties of any kind, either express or implied. We do not
                  warrant that the service will be uninterrupted or error-free.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  Limitation of Liability
                </h2>
                <p>
                  To the fullest extent permitted by law, minihabits shall not
                  be liable for any indirect, incidental, special,
                  consequential, or punitive damages resulting from your use of
                  the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Changes to Terms</h2>
                <p>
                  We reserve the right to modify or replace these Terms of Use
                  at any time. If a revision is material, we will provide at
                  least 30 days' notice prior to any new terms taking effect.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Contact</h2>
                <p>
                  If you have any questions about these Terms of Use, please
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
