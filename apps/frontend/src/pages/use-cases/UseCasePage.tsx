import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

type UseCaseSection = {
  title: string;
  points: string[];
};

type UseCasePageProps = {
  title: string;
  subtitle: string;
  description: string;
  sections: UseCaseSection[];
  ctaText?: string;
  metaDescription?: string;
};

export function UseCasePage({
  title,
  subtitle,
  description,
  sections,
  ctaText = 'Begin Practice',
  metaDescription,
}: UseCasePageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `🌱 ${title} • MiniHabits`;
    if (metaDescription) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', metaDescription);
    }
  }, [title, metaDescription]);

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-light tracking-tight">{title}</h1>
        <p className="text-lg text-muted-foreground">{subtitle}</p>
        <p className="text-base text-muted-foreground/80">{description}</p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {sections.map((section) => (
          <Card key={section.title} className="transition-zen hover-float">
            <CardContent className="pt-6 text-left space-y-3">
              <h2 className="text-xl font-medium">{section.title}</h2>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-3xl mx-auto text-center mt-12">
        <Button
          size="lg"
          className="animate-gentle-scale"
          onClick={() => navigate('/auth')}
        >
          {ctaText}
        </Button>
        <p className="text-sm text-muted-foreground mt-3">
          Gentle routines. Consistent progress.
        </p>
      </div>
    </div>
  );
}
