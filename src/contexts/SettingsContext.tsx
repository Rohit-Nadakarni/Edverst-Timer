
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  dailyGoal: number;
  updateSettings: (settings: Partial<SettingsState>) => void;
}

interface SettingsState {
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  dailyGoal: number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>({
    pomodoroTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    dailyGoal: 4, // 4 pomodoro sessions per day
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSettings = (newSettings: Partial<SettingsState>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('pomodoroSettings', JSON.stringify(updatedSettings));
  };

  return (
    <SettingsContext.Provider
      value={{
        pomodoroTime: settings.pomodoroTime,
        shortBreakTime: settings.shortBreakTime,
        longBreakTime: settings.longBreakTime,
        dailyGoal: settings.dailyGoal,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
