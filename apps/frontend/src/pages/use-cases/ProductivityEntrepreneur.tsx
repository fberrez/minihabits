import { UseCasePage } from './UseCasePage';

export default function ProductivityEntrepreneur() {
  return (
    <UseCasePage
      title="MiniHabits for Entrepreneurs & Productivity Enthusiasts 🚀"
      subtitle="Sustainable systems. Calm execution ⚙️"
      description="Replace hustle spikes with steady, deliberate practice—ship consistently without burnout."
      metaDescription="MiniHabits for entrepreneurs: consistent shipping, marketing routines, deep work, and mindful leadership."
      sections={[
        {
          title: 'Deep work cadence',
          points: [
            'Start with a 10-minute focus ritual',
            'Block small time for ideation and refinement',
            'Track context switches to reduce friction',
          ],
        },
        {
          title: 'Consistent shipping',
          points: [
            'Daily micro-deliverables',
            'Marketing touchpoints (write, post, connect)',
            'Iterate calmly—measure, adjust, repeat',
          ],
        },
        {
          title: 'Founder well-being',
          points: [
            'Movement, hydration, and sunlight',
            'Short reflection at end of day',
            'Sleep-first strategy for clarity',
          ],
        },
        {
          title: 'Team & leadership',
          points: [
            'Daily check-ins without micromanaging',
            'Tiny improvements to processes',
            'Gratitude notes to nurture culture',
          ],
        },
      ]}
    />
  );
}
