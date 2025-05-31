
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSettings } from '@/contexts/SettingsContext';
import { BarChart } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Analytics } from './Analytics';

export const Settings = () => {
  const { pomodoroTime, shortBreakTime, longBreakTime, dailyGoal, updateSettings } = useSettings();
  const [showAnalytics, setShowAnalytics] = useState(false);

  const [localSettings, setLocalSettings] = useState({
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
    dailyGoal,
  });

  const handleSave = () => {
    updateSettings(localSettings);
  };

  const formatTime = (minutes: number) => {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Pomodoro Duration: {formatTime(localSettings.pomodoroTime)}
          </label>
          <Slider
            value={[localSettings.pomodoroTime]}
            onValueChange={(value) => 
              setLocalSettings(prev => ({ ...prev, pomodoroTime: value[0] }))
            }
            max={60}
            min={15}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">
            Short Break Duration: {formatTime(localSettings.shortBreakTime)}
          </label>
          <Slider
            value={[localSettings.shortBreakTime]}
            onValueChange={(value) => 
              setLocalSettings(prev => ({ ...prev, shortBreakTime: value[0] }))
            }
            max={15}
            min={3}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">
            Long Break Duration: {formatTime(localSettings.longBreakTime)}
          </label>
          <Slider
            value={[localSettings.longBreakTime]}
            onValueChange={(value) => 
              setLocalSettings(prev => ({ ...prev, longBreakTime: value[0] }))
            }
            max={30}
            min={10}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">
            Daily Goal: {localSettings.dailyGoal} session{localSettings.dailyGoal !== 1 ? 's' : ''}
          </label>
          <Slider
            value={[localSettings.dailyGoal]}
            onValueChange={(value) => 
              setLocalSettings(prev => ({ ...prev, dailyGoal: value[0] }))
            }
            max={12}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} className="flex-1">
            Save Settings
          </Button>
          
          <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Analytics
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <Analytics />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
