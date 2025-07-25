"use client";

import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import {
  MdRestartAlt,
  MdPlayArrow,
  MdPause,
  MdTune,
  MdVolumeUp,
  MdVolumeOff,
  MdBarChart,
} from "react-icons/md";
import { Timer } from "../components/Timer";
import { PresetDialog } from "../components/Preset";
import { parsePreset } from "../utils/Utils";
import { MoveChart } from "../components/MoveChart";

const activeColor = "#77ff38";
const defaultColor = "#E7EBEF";

interface ClockState {
  player: string;
  sound: boolean;
  started: boolean;
  startTime?: Date;
  moveCount: number;
  preset: string;
  whiteRemaining: number;
  blackRemaining: number;
  increment: number;
  paused: boolean;
  blackMoves: number[];
  whiteMoves: number[];
  showChart: boolean;
}

const defaultSetup: ClockState = {
  startTime: undefined,
  moveCount: 0,
  player: "",
  sound: true,
  paused: false,
  started: false,
  blackMoves: [],
  whiteMoves: [],
  showChart: false,
  ...parsePreset("3 min | 2 sec"),
};

export default function Home() {
  const [open, setOpen] = useState(false);
  const [clockState, setClockState] = useState<ClockState>({
    ...defaultSetup,
  });

  console.log("Current clock state:", clockState);
  console.log("Dialog open:", open);

  const resetClock = () => {
    console.log("Reset clock clicked");
    setClockState({
      ...defaultSetup,
    });
  };

  const startGame = () => {
    console.log("Start game clicked, current state:", clockState);

    if (clockState.started && clockState.paused) {
      console.log("Resuming game");
      toast.info("Game Resumed");
      setClockState({
        ...clockState,
        paused: false,
        startTime: new Date(),
      });
      return;
    }

    console.log("Starting new game");
    toast.success("Game started");
    setClockState({
      ...clockState,
      player: clockState.paused ? clockState.player : "white",
      started: true,
      paused: false,
      moveCount: 0,
      startTime: new Date(),
    });
  };

  const stopClock = () => {
    console.log("Stop clock clicked");
    let blackRemaining = clockState.blackRemaining;
    let whiteRemaining = clockState.whiteRemaining;

    if (clockState.startTime) {
      if (clockState.player === "black") {
        whiteRemaining -=
          new Date().getTime() -
          clockState.startTime.getTime() +
          clockState.increment;
      } else {
        blackRemaining -=
          new Date().getTime() -
          clockState.startTime.getTime() +
          clockState.increment;
      }
    }

    setClockState({
      ...clockState,
      blackRemaining,
      whiteRemaining,
      paused: true,
    });
  };

  const setSoundOnOff = (isOn: boolean) => {
    console.log("Sound toggle clicked:", isOn);
    setClockState({
      ...clockState,
      sound: isOn,
    });
  };

  const updateState = (updatedFields: Partial<ClockState>) => {
    setClockState({ ...clockState, ...updatedFields });
  };

  const toggleChart = () => {
    console.log("Chart toggle clicked");
    updateState({ showChart: !clockState.showChart });
  };

  const handleOpenPreset = () => {
    console.log("Preset button clicked, opening dialog");
    setOpen(true);
  };

  const finishedMove = (player: "white" | "black") => {
    console.log("Move finished by:", player);

    if (clockState.blackRemaining <= 0 || clockState.whiteRemaining <= 0) {
      console.log("Game over - time expired");
      return;
    }
    if (
      !clockState.started ||
      (player !== clockState.player && clockState.moveCount > 0) ||
      (player === "black" && clockState.moveCount === 0)
    ) {
      console.log("Not your turn, skip");
      return;
    }
    let blackRemaining = clockState.blackRemaining;
    let whiteRemaining = clockState.whiteRemaining;
    let blackMoves = clockState.blackMoves;
    let whiteMoves = clockState.whiteMoves;

    if (clockState.startTime) {
      const moveTime = new Date().getTime() - clockState.startTime?.getTime();

      if (player === "white") {
        whiteRemaining = whiteRemaining - moveTime + clockState.increment;
        whiteMoves = [...whiteMoves, moveTime];
      } else {
        blackRemaining = blackRemaining - moveTime + clockState.increment;
        blackMoves = [...blackMoves, moveTime];
      }
      if (clockState.sound) {
        const audio = new Audio("/click.mp3");
        audio.play();
      }
    }
    setClockState({
      ...clockState,
      player: player === "white" ? "black" : "white",
      moveCount:
        player === "white" ? clockState.moveCount + 1 : clockState.moveCount,
      startTime: new Date(),
      blackRemaining,
      whiteRemaining,
      blackMoves,
      whiteMoves,
    });
  };

  const handleClosePreset = (preset: string) => {
    console.log("Preset dialog closed with:", preset);
    const newSetup = parsePreset(preset);

    setClockState({
      ...clockState,
      ...newSetup,
      paused: false,
      started: false,
      player: "",
      moveCount: 0,
    });
    setOpen(false);
  };

  const getColor = useCallback(
    (player: string) => {
      if (player === clockState.player) {
        const remaining =
          player === "white"
            ? clockState.whiteRemaining
            : clockState.blackRemaining;
        if (remaining < 30000) return "#fd0000";
        return activeColor;
      }
      return defaultColor;
    },
    [clockState.player, clockState.blackRemaining, clockState.whiteRemaining],
  );

  return (
    <div className="max-w-sm mx-auto h-screen flex flex-col justify-between items-stretch prevent-select">
      {/* Black Player Section */}
      <div
        className="flex flex-col justify-center items-center relative flex-1 min-h-[40vh] text-center"
        style={{
          backgroundColor: getColor("black"),
          transform: "rotate(180deg)",
          cursor: clockState.player === "black" ? "pointer" : "default",
        }}
        onClick={() => finishedMove("black")}
      >
        {clockState.showChart && <MoveChart data={clockState.blackMoves} />}
        <div className="absolute bottom-4 text-gray-700 prevent-select">
          {clockState.preset}
        </div>
        <Timer
          resetToken={clockState.startTime}
          time={clockState.blackRemaining}
          ticking={
            clockState.started &&
            !clockState.paused &&
            clockState.player === "black"
          }
        />
        <div className="absolute bottom-4 left-4 font-bold text-gray-700">
          Moves: {Math.max(0, clockState.moveCount - 1)}
        </div>
      </div>

      {/* Control Section */}
      <div className="bg-chess-control flex justify-around items-center py-2 flex-shrink-0">
        <button
          className="p-2 rounded-full hover:bg-gray-600 transition-colors"
          onClick={resetClock}
        >
          <MdRestartAlt className="text-red-500 text-2xl" />
        </button>

        {clockState.started && !clockState.paused && (
          <button
            className="p-2 rounded-full hover:bg-gray-600 transition-colors"
            onClick={stopClock}
          >
            <MdPause className="text-yellow-500 text-2xl" />
          </button>
        )}

        {(!clockState.started || clockState.paused) && (
          <button
            className="p-2 rounded-full hover:bg-gray-600 transition-colors"
            onClick={startGame}
          >
            <MdPlayArrow className="text-blue-500 text-2xl" />
          </button>
        )}

        <button
          className="p-2 rounded-full hover:bg-gray-600 transition-colors"
          onClick={handleOpenPreset}
        >
          <MdTune className="text-blue-500 text-2xl" />
        </button>

        {clockState.sound ? (
          <button
            className="p-2 rounded-full hover:bg-gray-600 transition-colors"
            onClick={() => setSoundOnOff(false)}
          >
            <MdVolumeUp className="text-blue-500 text-2xl" />
          </button>
        ) : (
          <button
            className="p-2 rounded-full hover:bg-gray-600 transition-colors"
            onClick={() => setSoundOnOff(true)}
          >
            <MdVolumeOff className="text-red-500 text-2xl" />
          </button>
        )}

        <button
          className="p-2 rounded-full hover:bg-gray-600 transition-colors"
          onClick={toggleChart}
        >
          <MdBarChart
            className={clockState.showChart ? "text-red-500" : "text-green-500"}
          />
        </button>
      </div>

      {/* White Player Section */}
      <div
        className="flex flex-col justify-center items-center relative flex-1 min-h-[40vh] text-center"
        style={{
          backgroundColor: getColor("white"),
          cursor: clockState.player === "white" ? "pointer" : "default",
        }}
        onClick={() => finishedMove("white")}
      >
        <div className="absolute top-4 text-gray-700 prevent-select">
          {clockState.preset}
        </div>
        {clockState.showChart && <MoveChart data={clockState.whiteMoves} />}
        <Timer
          resetToken={clockState.startTime}
          time={clockState.whiteRemaining}
          ticking={
            clockState.started &&
            !clockState.paused &&
            clockState.player === "white"
          }
        />
        <div className="absolute top-4 left-4 font-bold text-gray-700">
          Moves: {Math.max(clockState.moveCount, 0)}
        </div>
      </div>

      <PresetDialog
        open={open}
        onClose={handleClosePreset}
        selectedValue={clockState.preset}
      />
    </div>
  );
}
