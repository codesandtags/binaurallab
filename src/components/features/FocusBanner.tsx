import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function FocusBanner() {
  return (
    <Card className="bg-gradient-to-r from-primary to-primary/80 text-white p-8 flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold">Unlock Your Focus</h2>
        <p className="text-lg">Get in the zone with our new binaural beats sessions.</p>
      </div>
      <Button variant="outline" size="lg">
        Start a Session
      </Button>
    </Card>
  );
}
