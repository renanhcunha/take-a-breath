import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ChallengesContext } from './ChallengesContext';

interface CountdownContextData {
  minutes: number;
  seconds: number;
  totalCycleMinutes: number;
  hasFinished: boolean;
  isActive: boolean;
  startCountdown: () => void;
  resetCountdown: () => void;
  decreaseCountdown: () => void;
  increaseCountdown: () => void;
}

interface CountdownProviderProps {
  children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData);

let countdownTimeout: NodeJS.Timeout;

export function CountdownProvider({ children }: CountdownProviderProps){
  const { startNewChallenge } = useContext(ChallengesContext);

  const [time, setTime] = useState(25 * 60);
  const [totalCycleTime, setTotalCycleTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const totalCycleMinutes = Math.floor(totalCycleTime / 60);

  function startCountdown() {
    setIsActive(true);
  }

  function resetCountdown() {
    clearTimeout(countdownTimeout);
    setIsActive(false);
    setHasFinished(false);
    setTime(totalCycleTime);
  }

  function decreaseCountdown() {
    if (time > 60) {
      setTime(time - 60);
      setTotalCycleTime(totalCycleTime - 60);
    }

    return null;
  }

  function increaseCountdown() {
    if (time < 99 * 60) {
      setTime(time + 60);
      setTotalCycleTime(totalCycleTime + 60);
    }

    return null;
  }

  useEffect(() => {
    if (isActive && time > 0) {
      countdownTimeout = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      setHasFinished(true);
      setIsActive(false);
      startNewChallenge();
    }
  }, [isActive, time]);

  return (
    <CountdownContext.Provider value={{
      minutes,
      seconds,
      hasFinished,
      isActive,
      startCountdown,
      resetCountdown,
      decreaseCountdown,
      increaseCountdown,
      totalCycleMinutes
    }}>
      {children}
    </CountdownContext.Provider>
  );
}