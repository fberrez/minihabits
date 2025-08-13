import { UseCasePage } from './UseCasePage';

export default function Student() {
  return (
    <UseCasePage
      title="MiniHabits for Students 🎓"
      subtitle="Study with ease, focus with calm 📚"
      description="Create simple rituals that fit your semester rhythm—review, revise, and rest without burnout."
      metaDescription="Use MiniHabits to study smarter: gentle routines for reading, spaced repetition, assignments, and mindful breaks."
      sections={[
        {
          title: 'Daily study rituals',
          points: [
            '15-minute review blocks for each subject',
            'Spaced repetition reminders for memory',
            'Reading streaks to build momentum',
          ],
        },
        {
          title: 'Exam season basics',
          points: [
            'Plan minimal prep tasks per day',
            'Track mock tests and progress calmly',
            'Protect sleep and short breaks',
          ],
        },
        {
          title: 'Well-being & balance',
          points: [
            'Hydration and breath breaks',
            'Short walks to reset focus',
            'Gentle mindfulness check-ins',
          ],
        },
        {
          title: 'Projects & deadlines',
          points: [
            'Break tasks into tiny actions',
            'Track research, writing, and edits',
            'Consistent 1% improvement mindset',
          ],
        },
      ]}
    />
  );
}
