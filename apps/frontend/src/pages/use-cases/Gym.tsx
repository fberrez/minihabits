import { UseCasePage } from './UseCasePage';

export default function Gym() {
  return (
    <UseCasePage
      title="MiniHabits for Gym & Movement 🏋️"
      subtitle="Strength built gently, session by session 💪"
      description="Track small, repeatable actions—warm-ups, sets, steps, and recovery—to grow with patience."
      metaDescription="Use MiniHabits to make fitness consistent: simple gym routines, mobility, steps, hydration, and recovery."
      sections={[
        {
          title: 'Training foundation',
          points: [
            'Show up: even 5-minute sessions count',
            'Track sets, reps, or time—not perfection',
            'Celebrate consistency over intensity',
          ],
        },
        {
          title: 'Mobility & recovery',
          points: [
            'Short mobility flows daily',
            'Hydration and protein habits',
            'Sleep routine for better gains',
          ],
        },
        {
          title: 'Cardio & steps',
          points: [
            'Add gentle walks post-meal',
            'Track steps without pressure',
            'Light zone-2 sessions weekly',
          ],
        },
        {
          title: 'Mindful progress',
          points: [
            'Small PRs add up over time',
            'Deload weeks are part of growth',
            'Listen to your body cues',
          ],
        },
      ]}
    />
  );
}
