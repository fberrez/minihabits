import { Button } from '../components/ui/button';
import { HomeStats } from '@/components/home-stats';
import { useNavigate } from 'react-router-dom';
import { BooleanHabitCard } from '@/components/habits/boolean-habit-card';
import { CounterHabitCard } from '@/components/habits/counter-habit-card';
import { useEffect, useRef, useState } from 'react';
import JSConfetti from 'js-confetti';
import { HabitColor, HabitType, ExtendedHabit } from '../api/types/appTypes';
import moment from 'moment';
import { Card, CardContent } from '../components/ui/card';
import { AddNewButtons } from '@/components/add-new-buttons';
import { ChevronDown, Lock, Shield, CirclePlus } from 'lucide-react';
import FlickeringGrid from '@/components/ui/flickering-grid';
import { useTheme } from '@/components/theme-provider';
import {
  CompletionRateCard,
  CurrentStreakCard,
  LongestStreakCard,
} from '@/components/stats';
import CounterHeatmap from '@/components/stats/counter/CounterHeatmap';

export function Home() {
  const navigate = useNavigate();
  const jsConfettiRef = useRef<JSConfetti>(new JSConfetti());
  const [currentCard, setCurrentCard] = useState<'boolean' | 'counter'>(
    'boolean',
  );
  const [localCompletionStatus, setLocalCompletionStatus] = useState<
    Record<string, Record<string, number>>
  >({});
  const [showDescription, setShowDescription] = useState(true);
  const { theme } = useTheme();
  const [showScrollButton, setShowScrollButton] = useState(true);
  const heroSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollButton(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (heroSectionRef.current) {
      observer.observe(heroSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  type CompletionStatus = typeof localCompletionStatus;

  // Sample habits data for demonstration
  const booleanHabit: ExtendedHabit = {
    _id: 'boolean-sample',
    name: 'Morning Meditation',
    color: HabitColor.BLUE,
    type: HabitType.BOOLEAN,
    completedDates: {},
    targetCounter: 1,
    createdAt: new Date().toISOString(),
    userId: 'demo-user',
    currentStreak: 14,
    longestStreak: 20,
    completionRate7Days: 100,
    completionRateMonth: 100,
    completionRateYear: 100,
  };

  const counterHabit: ExtendedHabit = {
    ...booleanHabit,
    _id: 'counter-sample',
    name: 'Daily Water Intake',
    color: HabitColor.BLUE,
    type: HabitType.COUNTER,
    targetCounter: 10,
    completedDates: {
      '2024-12-31': 5,
      '2025-01-01': 2,
      '2025-01-02': 3,
      '2025-01-03': 7,
      '2025-01-04': 7,
      '2025-01-05': 5,
      '2025-01-06': 3,
      '2025-01-07': 4,
      '2025-01-08': 7,
      '2025-01-09': 4,
      '2025-01-10': 4,
      '2025-01-11': 9,
      '2025-01-12': 5,
      '2025-01-13': 2,
      '2025-01-14': 9,
      '2025-01-15': 2,
      '2025-01-16': 3,
      '2025-01-17': 5,
      '2025-01-18': 8,
      '2025-01-19': 2,
      '2025-01-20': 2,
      '2025-01-21': 8,
      '2025-01-22': 7,
      '2025-01-23': 6,
      '2025-01-24': 0,
      '2025-01-25': 1,
      '2025-01-26': 3,
      '2025-01-27': 7,
      '2025-01-28': 1,
      '2025-01-29': 2,
      '2025-01-30': 2,
      '2025-01-31': 0,
      '2025-02-01': 0,
      '2025-02-02': 0,
      '2025-02-03': 7,
      '2025-02-04': 5,
      '2025-02-05': 7,
      '2025-02-06': 8,
      '2025-02-07': 8,
      '2025-02-08': 0,
      '2025-02-09': 4,
      '2025-02-10': 8,
      '2025-02-11': 9,
      '2025-02-12': 8,
      '2025-02-13': 9,
      '2025-02-14': 1,
      '2025-02-15': 3,
      '2025-02-16': 1,
      '2025-02-17': 0,
      '2025-02-18': 2,
      '2025-02-19': 9,
      '2025-02-20': 2,
      '2025-02-21': 9,
      '2025-02-22': 4,
      '2025-02-23': 5,
      '2025-02-24': 7,
      '2025-02-25': 2,
      '2025-02-26': 2,
      '2025-02-27': 4,
      '2025-02-28': 0,
      '2025-03-01': 5,
      '2025-03-02': 1,
      '2025-03-03': 1,
      '2025-03-04': 3,
      '2025-03-05': 3,
      '2025-03-06': 0,
      '2025-03-07': 4,
      '2025-03-08': 6,
      '2025-03-09': 1,
      '2025-03-10': 8,
      '2025-03-11': 1,
      '2025-03-12': 5,
      '2025-03-13': 8,
      '2025-03-14': 7,
      '2025-03-15': 2,
      '2025-03-16': 5,
      '2025-03-17': 4,
      '2025-03-18': 9,
      '2025-03-19': 0,
      '2025-03-20': 6,
      '2025-03-21': 9,
      '2025-03-22': 4,
      '2025-03-23': 5,
      '2025-03-24': 0,
      '2025-03-25': 6,
      '2025-03-26': 7,
      '2025-03-27': 3,
      '2025-03-28': 3,
      '2025-03-29': 3,
      '2025-03-30': 2,
      '2025-03-31': 4,
      '2025-04-01': 3,
      '2025-04-02': 6,
      '2025-04-03': 6,
      '2025-04-04': 8,
      '2025-04-05': 4,
      '2025-04-06': 9,
      '2025-04-07': 8,
      '2025-04-08': 2,
      '2025-04-09': 3,
      '2025-04-10': 3,
      '2025-04-11': 9,
      '2025-04-12': 6,
      '2025-04-13': 4,
      '2025-04-14': 1,
      '2025-04-15': 9,
      '2025-04-16': 1,
      '2025-04-17': 2,
      '2025-04-18': 1,
      '2025-04-19': 7,
      '2025-04-20': 8,
      '2025-04-21': 7,
      '2025-04-22': 3,
      '2025-04-23': 9,
      '2025-04-24': 0,
      '2025-04-25': 9,
      '2025-04-26': 0,
      '2025-04-27': 4,
      '2025-04-28': 9,
      '2025-04-29': 0,
      '2025-04-30': 0,
      '2025-05-01': 8,
      '2025-05-02': 5,
      '2025-05-03': 1,
      '2025-05-04': 7,
      '2025-05-05': 8,
      '2025-05-06': 6,
      '2025-05-07': 8,
      '2025-05-08': 4,
      '2025-05-09': 4,
      '2025-05-10': 9,
      '2025-05-11': 0,
      '2025-05-12': 3,
      '2025-05-13': 0,
      '2025-05-14': 2,
      '2025-05-15': 1,
      '2025-05-16': 0,
      '2025-05-17': 2,
      '2025-05-18': 0,
      '2025-05-19': 5,
      '2025-05-20': 1,
      '2025-05-21': 8,
      '2025-05-22': 3,
      '2025-05-23': 4,
      '2025-05-24': 6,
      '2025-05-25': 5,
      '2025-05-26': 2,
      '2025-05-27': 2,
      '2025-05-28': 1,
      '2025-05-29': 1,
      '2025-05-30': 6,
      '2025-05-31': 4,
      '2025-06-01': 7,
      '2025-06-02': 7,
      '2025-06-03': 8,
      '2025-06-04': 5,
      '2025-06-05': 3,
      '2025-06-06': 2,
      '2025-06-07': 8,
      '2025-06-08': 5,
      '2025-06-09': 0,
      '2025-06-10': 0,
      '2025-06-11': 8,
      '2025-06-12': 3,
      '2025-06-13': 6,
      '2025-06-14': 9,
      '2025-06-15': 1,
      '2025-06-16': 7,
      '2025-06-17': 6,
      '2025-06-18': 5,
      '2025-06-19': 2,
      '2025-06-20': 5,
      '2025-06-21': 6,
      '2025-06-22': 3,
      '2025-06-23': 7,
      '2025-06-24': 2,
      '2025-06-25': 9,
      '2025-06-26': 9,
      '2025-06-27': 8,
      '2025-06-28': 9,
      '2025-06-29': 9,
      '2025-06-30': 5,
      '2025-07-01': 3,
      '2025-07-02': 5,
      '2025-07-03': 6,
      '2025-07-04': 3,
      '2025-07-05': 8,
      '2025-07-06': 2,
      '2025-07-07': 5,
      '2025-07-08': 7,
      '2025-07-09': 7,
      '2025-07-10': 2,
      '2025-07-11': 0,
      '2025-07-12': 4,
      '2025-07-13': 2,
      '2025-07-14': 4,
      '2025-07-15': 6,
      '2025-07-16': 9,
      '2025-07-17': 6,
      '2025-07-18': 9,
      '2025-07-19': 3,
      '2025-07-20': 9,
      '2025-07-21': 3,
      '2025-07-22': 8,
      '2025-07-23': 9,
      '2025-07-24': 2,
      '2025-07-25': 1,
      '2025-07-26': 9,
      '2025-07-27': 7,
      '2025-07-28': 5,
      '2025-07-29': 7,
      '2025-07-30': 9,
      '2025-07-31': 5,
      '2025-08-01': 7,
      '2025-08-02': 0,
      '2025-08-03': 5,
      '2025-08-04': 7,
      '2025-08-05': 6,
      '2025-08-06': 3,
      '2025-08-07': 2,
      '2025-08-08': 3,
      '2025-08-09': 6,
      '2025-08-10': 1,
      '2025-08-11': 9,
      '2025-08-12': 2,
      '2025-08-13': 1,
      '2025-08-14': 3,
      '2025-08-15': 4,
      '2025-08-16': 0,
      '2025-08-17': 4,
      '2025-08-18': 0,
      '2025-08-19': 5,
      '2025-08-20': 1,
      '2025-08-21': 7,
      '2025-08-22': 8,
      '2025-08-23': 6,
      '2025-08-24': 5,
      '2025-08-25': 0,
      '2025-08-26': 7,
      '2025-08-27': 4,
      '2025-08-28': 0,
      '2025-08-29': 2,
      '2025-08-30': 6,
      '2025-08-31': 3,
      '2025-09-01': 4,
      '2025-09-02': 3,
      '2025-09-03': 9,
      '2025-09-04': 7,
      '2025-09-05': 4,
      '2025-09-06': 8,
      '2025-09-07': 7,
      '2025-09-08': 1,
      '2025-09-09': 9,
      '2025-09-10': 8,
      '2025-09-11': 9,
      '2025-09-12': 0,
      '2025-09-13': 3,
      '2025-09-14': 1,
      '2025-09-15': 6,
      '2025-09-16': 4,
      '2025-09-17': 3,
      '2025-09-18': 8,
      '2025-09-19': 7,
      '2025-09-20': 9,
      '2025-09-21': 7,
      '2025-09-22': 5,
      '2025-09-23': 9,
      '2025-09-24': 4,
      '2025-09-25': 8,
      '2025-09-26': 8,
      '2025-09-27': 4,
      '2025-09-28': 6,
      '2025-09-29': 5,
      '2025-09-30': 1,
      '2025-10-01': 8,
      '2025-10-02': 1,
      '2025-10-03': 4,
      '2025-10-04': 8,
      '2025-10-05': 1,
      '2025-10-06': 7,
      '2025-10-07': 0,
      '2025-10-08': 8,
      '2025-10-09': 4,
      '2025-10-10': 9,
      '2025-10-11': 3,
      '2025-10-12': 6,
      '2025-10-13': 1,
      '2025-10-14': 7,
      '2025-10-15': 8,
      '2025-10-16': 7,
      '2025-10-17': 6,
      '2025-10-18': 8,
      '2025-10-19': 3,
      '2025-10-20': 1,
      '2025-10-21': 2,
      '2025-10-22': 5,
      '2025-10-23': 0,
      '2025-10-24': 3,
      '2025-10-25': 9,
      '2025-10-26': 7,
      '2025-10-27': 4,
      '2025-10-28': 2,
      '2025-10-29': 5,
      '2025-10-30': 2,
      '2025-10-31': 8,
      '2025-11-01': 0,
      '2025-11-02': 9,
      '2025-11-03': 0,
      '2025-11-04': 5,
      '2025-11-05': 8,
      '2025-11-06': 8,
      '2025-11-07': 9,
      '2025-11-08': 2,
      '2025-11-09': 4,
      '2025-11-10': 3,
      '2025-11-11': 2,
      '2025-11-12': 7,
      '2025-11-13': 1,
      '2025-11-14': 6,
      '2025-11-15': 1,
      '2025-11-16': 8,
      '2025-11-17': 6,
      '2025-11-18': 5,
      '2025-11-19': 8,
      '2025-11-20': 0,
      '2025-11-21': 3,
      '2025-11-22': 3,
      '2025-11-23': 6,
      '2025-11-24': 0,
      '2025-11-25': 4,
      '2025-11-26': 2,
      '2025-11-27': 6,
      '2025-11-28': 2,
      '2025-11-29': 6,
      '2025-11-30': 9,
      '2025-12-01': 5,
      '2025-12-02': 0,
      '2025-12-03': 9,
      '2025-12-04': 3,
      '2025-12-05': 8,
      '2025-12-06': 5,
      '2025-12-07': 6,
      '2025-12-08': 3,
      '2025-12-09': 8,
      '2025-12-10': 9,
      '2025-12-11': 0,
      '2025-12-12': 1,
      '2025-12-13': 9,
      '2025-12-14': 7,
      '2025-12-15': 6,
      '2025-12-16': 4,
      '2025-12-17': 7,
      '2025-12-18': 2,
      '2025-12-19': 1,
      '2025-12-20': 6,
      '2025-12-21': 3,
      '2025-12-22': 8,
      '2025-12-23': 4,
      '2025-12-24': 1,
      '2025-12-25': 7,
      '2025-12-26': 6,
      '2025-12-27': 7,
      '2025-12-28': 7,
      '2025-12-29': 5,
      '2025-12-30': 7,
    },
  };

  // Sample dates for the last 3 days
  const dates = [new Date()];

  const descriptions = {
    boolean:
      'Start with simple yes/no habits. Perfect for daily routines like meditation or reading.',
    counter:
      'Track habits with specific targets. Great for water intake, steps, or any countable goal.',
  };

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('section:nth-of-type(2)');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section
        ref={heroSectionRef}
        className="min-h-[calc(100vh-3.5rem)] flex items-center relative"
      >
        <FlickeringGrid
          className="absolute inset-0 z-0 hidden md:block [mask-image:radial-gradient(1000px_800px_at_top,white,transparent)]"
          squareSize={12}
          gridGap={4}
          color={theme === 'dark' ? '#ffffff' : '#000000'}
          maxOpacity={0.2}
          flickerChance={0.05}
          height={2000}
          width={2000}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:items-center">
            {/* Left Column */}
            <div className="flex flex-col justify-center space-y-8 text-center md:text-left">
              <div className="relative">
                <HomeStats />
                <h1 className="text-6xl font-bold mb-4 tracking-tighter">
                  minihabits.
                </h1>
                <p className="text-lg text-gray-600 max-w-md mx-auto md:mx-0">
                  Track your habits and build lasting habits
                </p>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <Button
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="relative"
                >
                  Get Started
                </Button>
                <p className="text-sm text-gray-600 mt-4">
                  Free to use. No credit card required
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex justify-center">
              <div className="w-full max-w-md transition-all duration-500 ease-in-out">
                <div className="space-y-4 transition-all duration-500 ease-in-out">
                  {/* Arrow and text */}
                  <div className="hidden md:flex justify-end mb-2">
                    <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                      <p className="text-sm font-medium">Try it!</p>
                      <svg
                        className="w-4 h-4 text-primary transform rotate-90 animated-bounce"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>
                  {currentCard === 'boolean' && (
                    <div className="relative">
                      <BooleanHabitCard
                        habit={booleanHabit}
                        dates={dates}
                        formatDate={(date) =>
                          date.toLocaleDateString('en-US', { weekday: 'short' })
                        }
                        localCompletionStatus={localCompletionStatus}
                        setLocalCompletionStatus={(value) => {
                          setLocalCompletionStatus(value);
                          const [date] = dates;
                          const formattedDate =
                            moment(date).format('YYYY-MM-DD');
                          const isCompleted =
                            (value as CompletionStatus)[booleanHabit._id]?.[
                              formattedDate
                            ] > 0;
                          if (isCompleted) {
                            setCurrentCard('counter');
                            setLocalCompletionStatus({});
                          }
                        }}
                        onTrack={async () => {}}
                        onUntrack={async () => {}}
                        jsConfettiRef={jsConfettiRef}
                        isHomePage={true}
                        showOptions={false}
                        glowEffect={true}
                      />
                    </div>
                  )}
                  {currentCard === 'counter' && !showDescription && (
                    <div className="animate-fade-in w-full">
                      <AddNewButtons redirectToAuth={true} />
                    </div>
                  )}
                  {currentCard === 'counter' && showDescription && (
                    <CounterHabitCard
                      habit={counterHabit}
                      dates={dates}
                      formatDate={(date) =>
                        date.toLocaleDateString('en-US', { weekday: 'short' })
                      }
                      localCompletionStatus={localCompletionStatus}
                      setLocalCompletionStatus={(value) => {
                        setLocalCompletionStatus(value);
                        const [date] = dates;
                        const formattedDate = moment(date).format('YYYY-MM-DD');
                        const isCompleted =
                          (value as CompletionStatus)[counterHabit._id]?.[
                            formattedDate
                          ] >= counterHabit.targetCounter;
                        if (isCompleted) {
                          setShowDescription(false);
                          setLocalCompletionStatus({});
                        }
                      }}
                      onIncrement={async () => {}}
                      onDecrement={async () => {}}
                      jsConfettiRef={jsConfettiRef}
                      isHomePage={true}
                      showOptions={false}
                      glowEffect={true}
                    />
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    {showDescription
                      ? descriptions[currentCard]
                      : 'Add your first habit now!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Button */}
        <div
          className={`hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-300 ${
            showScrollButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full animate-bounce backdrop-blur-sm bg-background/50 flex flex-col gap-1 h-auto py-2 px-4 w-auto"
            onClick={scrollToNextSection}
          >
            <p className="text-sm font-medium">Scroll Down</p>
            <ChevronDown className="h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Life Challenges Section */}
      <section className="py-24 mb-24">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Why is it so hard to stick to your habits?
              </h2>
              <p className="text-muted-foreground mt-2">
                Understanding the challenges of building a better life
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="font-semibold text-xl mb-4">
                    Lack of Direction
                  </h3>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      How to identify what truly matters?
                    </p>
                    <p className="text-muted-foreground">
                      Where to focus your energy?
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-4">⏰</div>
                  <h3 className="font-semibold text-xl mb-4">Inconsistency</h3>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      Watching productivity videos
                    </p>
                    <p className="text-muted-foreground">
                      Hard to stay focused on your goals
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-4">🌊</div>
                  <h3 className="font-semibold text-xl mb-4">Overwhelm</h3>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      Burnout from too many changes
                    </p>
                    <p className="text-muted-foreground">
                      Giving up on your goals
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats and Habit Tracking Section */}
      <section className="py-24 mb-24">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold tracking-tight">
                Track Your Life
              </h2>
              <p className="text-muted-foreground mt-2">
                Beautiful visualizations to keep you motivated
              </p>
            </div>

            {/* Yearly Heatmap */}
            <div className="grid grid-cols-1 gap-6">
              <CounterHeatmap habit={counterHabit} />
            </div>

            {/* Streak and Completion Rate Cards */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
              <CurrentStreakCard
                habit={booleanHabit}
                currentStreak={booleanHabit.currentStreak}
              />

              <LongestStreakCard
                habit={booleanHabit}
                longestStreak={booleanHabit.longestStreak}
              />

              <CompletionRateCard
                habit={booleanHabit}
                completionRate={booleanHabit.completionRate7Days || 100}
                title="Completion Rate"
                description="Last 7 days"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <CompletionRateCard
                habit={booleanHabit}
                completionRate={booleanHabit.completionRateMonth || 100}
                title="Monthly Rate"
                description="This month (completed days only)"
              />

              <CompletionRateCard
                habit={booleanHabit}
                completionRate={booleanHabit.completionRateYear || 100}
                title="Yearly Rate"
                description="This year (completed days only)"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Data Security Section */}
      <section className="py-24 mb-24 bg-gradient-to-r ">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="text-left space-y-5 flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-blue-800 dark:text-blue-300">
                Your Data is Safe with Us
              </h2>
              <p className="text-muted-foreground text-lg">
                All your habit data is securely stored in European data centers,
                complying with GDPR and the highest privacy standards.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-3 bg-white dark:bg-blue-950/40 p-3 rounded-lg shadow-sm">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">EU-based servers</span>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-blue-950/40 p-3 rounded-lg shadow-sm">
                  <CirclePlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">GDPR compliant</span>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-blue-950/40 p-3 rounded-lg shadow-sm">
                  <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">Secure storage</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 w-40 md:w-48">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg"
                alt="European Union Flag"
                className="w-full h-auto drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold tracking-tight">
              Start Building Better Habits Today
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of users who have transformed their lives with
              small, consistent changes. Your journey to a better you starts
              with a single habit.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="text-lg px-8"
                onClick={() => navigate('/auth')}
              >
                Get Started for Free
              </Button>
            </div>
            <div className="pt-8 text-sm text-muted-foreground">
              No credit card required • 100% free forever
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
