
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Analytics = () => {
  const { todayFocusTime, totalFocusTime, currentStreak, completedSessions, getTodayProgress } = useAnalytics();
  const { dailyGoal } = useSettings();

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    }
    
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
  };

  const todayProgress = getTodayProgress(dailyGoal);
  const sessionsToday = Math.floor(todayFocusTime / 25); // Assuming 25min sessions for calculation

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Focus Analytics</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Sessions completed</span>
              <span className="font-semibold">{sessionsToday}/{dailyGoal}</span>
            </div>
            <Progress value={todayProgress} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {Math.round(todayProgress)}% of daily goal
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Today's Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {formatHours(todayFocusTime)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {currentStreak} day{currentStreak !== 1 ? 's' : ''}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Total Focus Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {formatHours(totalFocusTime)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {completedSessions}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
