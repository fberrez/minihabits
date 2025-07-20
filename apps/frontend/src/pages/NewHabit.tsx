import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHabits } from "../api/hooks/useHabits";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { HabitColor, HabitType } from "../api/types/appTypes";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Lightbulb } from "lucide-react";
import { ColorPicker } from "../components/color-picker";

const habitSuggestions = [
  "Read for 5 minutes",
  "Meditate for 5 minutes",
  "Do 10 pushups",
  "Write 10 sentences",
  "Do not pick up phone before 9am",
  "Drink a glass of water",
  "Take a 5-minute walk",
  "Stretch for 5 minutes",
  "Plan your day",
];

const getRandomColor = () => {
  const colors = Object.values(HabitColor);
  return colors[Math.floor(Math.random() * colors.length)];
};

export function NewHabit() {
  const [name, setName] = useState("");
  const [color, setColor] = useState<HabitColor>(getRandomColor());
  const [type, setType] = useState<HabitType>(HabitType.BOOLEAN);
  const [targetCounter, setTargetCounter] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const { createHabit } = useHabits();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !color) {
      toast({
        title: "Missing required fields",
        description: "Please provide both a habit name and select a color.",
        variant: "destructive",
      });
      return;
    }

    if (type === HabitType.COUNTER && (!targetCounter || targetCounter <= 0)) {
      toast({
        title: "Invalid target counter",
        description:
          type === HabitType.COUNTER
            ? "Please provide a target counter greater than 0 for counter type habits."
            : "Please provide a limit counter greater than 0 for limit type habits.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await createHabit(
        name,
        color,
        type,
        type === HabitType.COUNTER ? targetCounter : undefined
      );
      toast({
        title: "Habit created",
        description: "Your new habit has been created successfully.",
      });
      navigate("/");
    } catch {
      toast({
        title: "Error",
        description: "Failed to create habit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setName(suggestion);
  };

  return (
    <div className="max-w-[2000px] mx-auto px-8 py-8">
      <Card className="max-w-[600px] mx-auto">
        <CardHeader>
          <CardTitle>Create a new habit</CardTitle>
          <CardDescription>
            Start with a tiny habit - something so easy you can't say no. The
            key is consistency, not intensity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Mini Habits Tip:</strong> Make it so small that it feels
              ridiculous. You can always do more, but start with the minimum to
              build consistency.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="name">Habit name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Read for 10 minute"
                disabled={isLoading}
                required
              />
              <div className="space-y-2 flex flex-col items-center">
                <Label className="text-sm text-muted-foreground">
                  Suggestions (click to use):
                </Label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {habitSuggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-sm"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 flex flex-col items-center">
              <Label>Type</Label>
              <RadioGroup
                value={type}
                onValueChange={(value: HabitType) => setType(value)}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={HabitType.BOOLEAN} id="boolean" />
                  <Label htmlFor="boolean">Daily Check</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={HabitType.COUNTER} id="counter" />
                  <Label htmlFor="counter">Counter</Label>
                </div>
              </RadioGroup>
            </div>

            {type === HabitType.COUNTER && (
              <div className="space-y-2">
                <Label htmlFor="targetCounter">
                  {type === HabitType.COUNTER ? "Daily Target" : "Daily Limit"}
                </Label>
                <Input
                  id="targetCounter"
                  type="number"
                  min="1"
                  value={targetCounter}
                  onChange={(e) => setTargetCounter(parseInt(e.target.value))}
                  placeholder={
                    type === HabitType.COUNTER
                      ? "e.g., 8 glasses of water"
                      : "e.g., max 2 hours of social media"
                  }
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            <ColorPicker
              value={color}
              onChange={(value: HabitColor) => setColor(value)}
              disabled={isLoading}
            />
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? "Creating..." : "Create Habit"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
