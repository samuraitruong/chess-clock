import React, { useCallback, useEffect, useState, useRef } from "react";
import { formatTime } from "../utils/Utils";

export function Timer({
  time,
  ticking,
  resetToken,
}: {
  time: number;
  ticking?: boolean;
  resetToken?: Date;
}) {
  const [countingTime, setCountingTime] = useState(time);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer(); // Clear any existing timer first

    if (!ticking) return;

    const interval = countingTime < 60000 ? 100 : 500;

    intervalRef.current = setInterval(() => {
      setCountingTime((prevTime) => {
        const newTime = prevTime - interval;
        if (newTime <= 0) {
          clearTimer();
          return 0;
        }
        return newTime;
      });
    }, interval);
  }, [ticking, countingTime, clearTimer]);

  // Reset timer when resetToken or time changes
  useEffect(() => {
    setCountingTime(time);
  }, [resetToken, time]);

  // Start/stop timer based on ticking state
  useEffect(() => {
    if (ticking) {
      startTimer();
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [ticking, startTimer, clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return (
    <div className="timer-text text-gray-700 font-bold select-none">
      {formatTime(countingTime)}
    </div>
  );
}
