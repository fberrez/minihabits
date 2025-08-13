import { UseCasePage } from './UseCasePage';

export default function Parent() {
  return (
    <UseCasePage
      title="MiniHabits for Parents 👨‍👩‍👧‍👦"
      subtitle="Gentle structure for dynamic days 🧺"
      description="Build tiny, resilient routines that fit family life—sleep, meals, tidying, and self-care."
      metaDescription="MiniHabits for parents: small routines for meals, tidying, family time, and personal well-being."
      sections={[
        {
          title: 'Home rhythms',
          points: [
            'Five-minute tidy sprints',
            'Simple meal prep moments',
            'Reset corners to reduce clutter',
          ],
        },
        {
          title: 'Family connection',
          points: [
            'Micro-rituals for presence',
            'Device-free minutes daily',
            'Gratitude rounds in the evening',
          ],
        },
        {
          title: 'Self-care basics',
          points: [
            'Hydration, sunlight, and breath',
            'Short walks with or without stroller',
            'Gentle boundaries for rest',
          ],
        },
        {
          title: 'Calm planning',
          points: [
            'Daily 3-minute plan, weekly 10-minute review',
            'Tiny wins on busy days still count',
            'Let the system flex with life',
          ],
        },
      ]}
    />
  );
}
