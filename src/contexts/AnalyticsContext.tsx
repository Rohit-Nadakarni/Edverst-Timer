
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AnalyticsContextType {
  todayFocusTime: number;
  totalFocusTime: number;
  currentStreak: number;
  completedSessions: number;
  addFocusSession: (duration: number) => void;
  getTodayProgress: (dailyGoal: number) => number;
}

interface AnalyticsData {
  todayFocusTime: number;
  totalFocusTime: number;
  currentStreak: number;
  completedSessions: number;
  lastSessionDate: string;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    todayFocusTime: 0,
    totalFocusTime: 0,
    currentStreak: 0,
    completedSessions: 0,
    lastSessionDate: '',
  });

  useEffect(() => {
    const savedAnalytics = localStorage.getItem('pomodoroAnalytics');
    if (savedAnalytics) {
      const data = JSON.parse(savedAnalytics);
      const today = new Date().toDateString();
      
      // Reset today's focus time if it's a new day
      if (data.lastSessionDate !== today) {
        data.todayFocusTime = 0;
      }
      
      setAnalytics(data);
    }
  }, []);

  const addFocusSession = (duration: number) => {
    const today = new Date().toDateString();
    const isNewDay = analytics.lastSessionDate !== today;
    
    const updatedAnalytics = {
      ...analytics,
      todayFocusTime: isNewDay ? duration : analytics.todayFocusTime + duration,
      totalFocusTime: analytics.totalFocusTime + duration,
      completedSessions: analytics.completedSessions + 1,
      currentStreak: isNewDay ? analytics.currentStreak + 1 : analytics.currentStreak,
      lastSessionDate: today,
    };
    
    setAnalytics(updatedAnalytics);
    localStorage.setItem('pomodoroAnalytics', JSON.stringify(updatedAnalytics));
  };

  const getTodayProgress = (dailyGoal: number) => {
    return Math.min((analytics.completedSessions / dailyGoal) * 100, 100);
  };

  return (
    <AnalyticsContext.Provider
      value={{
        todayFocusTime: analytics.todayFocusTime,
        totalFocusTime: analytics.totalFocusTime,
        currentStreak: analytics.currentStreak,
        completedSessions: analytics.completedSessions,
        addFocusSession,
        getTodayProgress,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};
