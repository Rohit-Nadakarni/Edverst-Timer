
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Music, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpotifyPlayer } from '@/components/SpotifyPlayer';
import { TodoList } from '@/components/TodoList';
import { Settings as SettingsComponent } from '@/components/Settings';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';
import { AnalyticsProvider, useAnalytics } from '@/contexts/AnalyticsContext';

const TimerContent = () => {
  const { pomodoroTime, shortBreakTime, longBreakTime } = useSettings();
  const { addFocusSession } = useAnalytics();
  
  const [timeLeft, setTimeLeft] = useState(pomodoroTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<'pomodoro' | 'short-break' | 'long-break'>('pomodoro');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showTodos, setShowTodos] = useState(false);
  const [showSpotify, setShowSpotify] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const sessionDurations = {
    pomodoro: pomodoroTime * 60,
    'short-break': shortBreakTime * 60,
    'long-break': longBreakTime * 60
  };

  // Update timeLeft when settings change
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(sessionDurations[sessionType]);
    }
  }, [pomodoroTime, shortBreakTime, longBreakTime, sessionType, isActive]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      
      // Add completed session to analytics if it was a pomodoro
      if (sessionType === 'pomodoro') {
        addFocusSession(pomodoroTime);
      }
      
      // Auto-switch to next session type could be added here
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, sessionType, pomodoroTime, addFocusSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(sessionDurations[sessionType]);
  };

  const switchSession = (type: 'pomodoro' | 'short-break' | 'long-break') => {
    setSessionType(type);
    setTimeLeft(sessionDurations[type]);
    setIsActive(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with Japanese cherry blossom image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 182, 193, 0.2), rgba(255, 192, 203, 0.3)), url('https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header with todo and music buttons */}
        <div className="flex items-center justify-between w-full max-w-4xl mb-8">
          <Dialog open={showTodos} onOpenChange={setShowTodos}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="p-3 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-105"
              >
                <ListTodo className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <TodoList />
            </DialogContent>
          </Dialog>

          <div className="text-center">
            <h1 className="text-white text-3xl font-light tracking-wide mb-2">
              edverst timer
            </h1>
            <p className="text-white/80 text-sm font-light tracking-wide">
              BY ROHIT NADAKARNI
            </p>
          </div>

          <Dialog open={showSpotify} onOpenChange={setShowSpotify}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="p-3 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-105"
              >
                <Music className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <SpotifyPlayer />
            </DialogContent>
          </Dialog>
        </div>

        {/* Session type buttons */}
        <div className="flex gap-4 mb-12">
          <Button
            variant={sessionType === 'pomodoro' ? 'default' : 'outline'}
            onClick={() => switchSession('pomodoro')}
            className={`px-6 py-2 rounded-full border-2 transition-all duration-300 ${
              sessionType === 'pomodoro'
                ? 'bg-white text-pink-900 border-white hover:bg-white/90'
                : 'bg-transparent text-white border-white/50 hover:border-white hover:bg-white/10'
            }`}
          >
            pomodoro
          </Button>
          <Button
            variant={sessionType === 'short-break' ? 'default' : 'outline'}
            onClick={() => switchSession('short-break')}
            className={`px-6 py-2 rounded-full border-2 transition-all duration-300 ${
              sessionType === 'short-break'
                ? 'bg-white text-pink-900 border-white hover:bg-white/90'
                : 'bg-transparent text-white border-white/50 hover:border-white hover:bg-white/10'
            }`}
          >
            short break
          </Button>
          <Button
            variant={sessionType === 'long-break' ? 'default' : 'outline'}
            onClick={() => switchSession('long-break')}
            className={`px-6 py-2 rounded-full border-2 transition-all duration-300 ${
              sessionType === 'long-break'
                ? 'bg-white text-pink-900 border-white hover:bg-white/90'
                : 'bg-transparent text-white border-white/50 hover:border-white hover:bg-white/10'
            }`}
          >
            long break
          </Button>
        </div>

        {/* Timer display */}
        <div className="text-center mb-12">
          <div className="text-white text-8xl md:text-9xl font-light tracking-wider mb-4 font-mono">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center gap-6">
          <Button
            onClick={toggleTimer}
            className="px-8 py-3 bg-white text-pink-900 hover:bg-white/90 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105"
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                start
              </>
            )}
          </Button>
          
          <Button
            onClick={resetTimer}
            variant="ghost"
            className="p-3 text-white hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>
          
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="p-3 text-white hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-105"
              >
                <Settings className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <SettingsComponent />
            </DialogContent>
          </Dialog>
        </div>

        {/* Progress indicator */}
        <div className="mt-12 w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-1000 ease-out"
            style={{ 
              width: `${((sessionDurations[sessionType] - timeLeft) / sessionDurations[sessionType]) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <SettingsProvider>
      <AnalyticsProvider>
        <TimerContent />
      </AnalyticsProvider>
    </SettingsProvider>
  );
};

export default Index;
