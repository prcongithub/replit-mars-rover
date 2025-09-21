import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROVER_NAMES, CAMERA_TYPES, type RoverName, type CameraType } from "@shared/schema";
import { Bot, Satellite, Zap } from "lucide-react";

interface FilterSectionProps {
  selectedRover: RoverName;
  selectedCamera: CameraType;
  selectedSol: number;
  onRoverChange: (rover: RoverName) => void;
  onCameraChange: (camera: CameraType) => void;
  onSolChange: (sol: number) => void;
}

const roverIcons = {
  curiosity: Bot,
  opportunity: Satellite,
  spirit: Zap,
};

export default function FilterSection({
  selectedRover,
  selectedCamera,
  selectedSol,
  onRoverChange,
  onCameraChange,
  onSolChange,
}: FilterSectionProps) {
  return (
    <section className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex flex-col space-y-3">
          <Label className="text-sm font-medium text-muted-foreground">Select Rover</Label>
          <div className="flex flex-wrap gap-3">
            {ROVER_NAMES.map((rover) => {
              const Icon = roverIcons[rover];
              const isSelected = selectedRover === rover;
              return (
                <Button
                  key={rover}
                  data-testid={`button-rover-${rover}`}
                  variant={isSelected ? "default" : "secondary"}
                  onClick={() => onRoverChange(rover)}
                  className="px-6 py-3 font-medium transition-colors"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {rover.charAt(0).toUpperCase() + rover.slice(1)}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <Label className="text-sm font-medium text-muted-foreground">Camera Type</Label>
          <Select value={selectedCamera} onValueChange={(value: CameraType) => onCameraChange(value)}>
            <SelectTrigger data-testid="select-camera" className="w-full md:w-64">
              <SelectValue placeholder="Select camera" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CAMERA_TYPES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-3">
          <Label className="text-sm font-medium text-muted-foreground">Mars Sol (Day)</Label>
          <Input
            data-testid="input-sol"
            type="number"
            placeholder="1000"
            min="1"
            max="4200"
            value={selectedSol}
            onChange={(e) => onSolChange(parseInt(e.target.value) || 1000)}
            className="w-full md:w-32"
          />
        </div>
      </div>
    </section>
  );
}
