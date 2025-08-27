import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WelcomeCardProps {
  title: string;
  description: string;
  onGetStarted: () => void;
}

export function WelcomeCard({ title, description, onGetStarted }: WelcomeCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-center">
          {description}
        </p>
        <Button 
          onClick={onGetStarted} 
          className="w-full"
          size="lg"
        >
          Comenzar
        </Button>
      </CardContent>
    </Card>
  );
}
