import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const items = [
  {
    to: '/use-cases/student',
    title: 'Students 🎓',
    description: 'Study with calm, retain with ease.',
  },
  {
    to: '/use-cases/productivity-entrepreneur',
    title: 'Productivity & Entrepreneurs 🚀',
    description: 'Sustainable systems for steady shipping.',
  },
  {
    to: '/use-cases/gym',
    title: 'Gym & Movement 🏋️',
    description: 'Strength built gently, session by session.',
  },
  {
    to: '/use-cases/parent',
    title: 'Parents 👨‍👩‍👧‍👦',
    description: 'Gentle structure for dynamic days.',
  },
  {
    to: '/use-cases/mindfulness',
    title: 'Mindfulness 🧘',
    description: 'Quiet moments, practiced daily.',
  },
];

export default function UseCases() {
  useEffect(() => {
    document.title = '🌱 Use Cases • MiniHabits';
  }, []);

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-light tracking-tight">Use Cases</h1>
        <p className="text-lg text-muted-foreground">
          Explore gentle workflows that fit your life.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
        {items.map((item) => (
          <Link
            to={item.to}
            key={item.to}
            className="transition-zen hover-float"
          >
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium">{item.title}</h2>
                <p className="text-muted-foreground mt-2">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
