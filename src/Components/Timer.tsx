import React, { useCallback, useEffect, useState } from "react";
import { styled, Typography } from "@mui/material";
import { formatTime } from "../Utils";

const ClockTime = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle1,
  color: theme.palette.text.secondary,
  fontWeight: "bold",
  fontSize: "5rem",
}));

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

  let timerInterval: any = undefined;

  const updateTimer = useCallback(() => {
    if (!ticking && timerInterval) {
      clearInterval(timerInterval);
      return;
    }

    if (!ticking) {
      return;
    }
    const interval = countingTime < 60000 ? 200 : 1000;

    if (!timerInterval) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timerInterval = setInterval(() => {
        setCountingTime(countingTime - interval);
      }, interval);
    }
    if (countingTime <= 0) {
      clearInterval(timerInterval);
      setCountingTime(0);
    }
  }, [ticking, time, countingTime]);

  useEffect(() => {
    setCountingTime(time);
  }, [resetToken, time]);

  useEffect(() => {
    updateTimer();

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [updateTimer, time, timerInterval]);

  return <ClockTime>{formatTime(countingTime)}</ClockTime>;
}
