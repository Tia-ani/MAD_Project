import React, { createContext, useState } from 'react';

export const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    largeText: false,
    highContrast: false,
    audioNavigation: false,
    accessibilityAlerts: true,
    preferWheelchair: false,
    requireElevators: false,
    avoidIssues: true,
    pushNotifications: true,
    realTimeUpdates: true,
    speechRate: 0.75,
  });

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
};