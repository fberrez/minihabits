import { UseCasePage } from './UseCasePage';

export default function Mindfulness() {
  return (
    <UseCasePage
      title="MiniHabits for Mindfulness 🧘"
      subtitle="Quiet moments, practiced daily 🌿"
      description="Gently weave meditation and awareness into your day—no pressure, just presence."
      metaDescription="MiniHabits for mindfulness: daily breath, short meditations, reflection, and awareness practices."
      sections={[
        {
          title: 'Meditation & breath',
          points: [
            'Start with one mindful breath',
            '2–5 minutes seated practice',
            'Soft timer, no judgment',
          ],
        },
        {
          title: 'Awareness cues',
          points: [
            'Anchor moments (doors, kettle, emails)',
            'Body scans while waiting',
            'Gratitude notes mid-day',
          ],
        },
        {
          title: 'Evening reflection',
          points: [
            'One line in a journal',
            'Release what can wait',
            'Set an intention for tomorrow',
          ],
        },
        {
          title: 'Compassionate progress',
          points: [
            'Missed days are part of practice',
            'Return lightly, continue gently',
            'Let the habit support, not demand',
          ],
        },
      ]}
    />
  );
}
