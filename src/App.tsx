import React, { useCallback } from "react";
import "./App.css";
import { Box, Container, styled, Typography } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TuneIcon from "@mui/icons-material/Tune";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import PauseIcon from "@mui/icons-material/Pause";
import { Timer } from "./Components/Timer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PresetDialog } from "./Components/Preset";
import { parsePreset } from "./Utils";
import IconButton from "@mui/material/IconButton";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#E7EBEF",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  minHeight: "40vh",
  color: theme.palette.text.secondary,
  justifyContent: "center",
  position: "relative",
  flexBasis: 0,
  flexGrow: 1,
}));

const ControlBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#333436",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  color: theme.palette.text.secondary,
  justifyContent: "space-around",
  flexBasis: 0,
  flexGrow: 0.1,
}));

const PresetBox = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.secondary,
  position: "absolute",
  bottom: "1rem",
}));

const MoveBox = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.secondary,
  position: "absolute",
  bottom: "1rem",
  left: "1rem",
  fontWeight: "bold",
}));

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
}

const defaultSetup: ClockState = {
  startTime: undefined,
  moveCount: 0,
  player: "",
  sound: true,
  paused: false,
  started: false,
  ...parsePreset("3 min | 2 sec"),
};
function App() {
  const [open, setOpen] = React.useState(false);

  const [clockState, setClockState] = React.useState<ClockState>({
    ...defaultSetup,
  });

  const resetClock = () => {
    setClockState({
      ...defaultSetup,
    });
  };
  const startGame = () => {
    if (clockState.started && clockState.paused) {
      toast.info("Game Resumed");
      setClockState({
        ...clockState,
        paused: false,
        startTime: new Date(),
      });
      return;
    }

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
    let blackRemaining = clockState.blackRemaining;
    let whiteRemaining = clockState.whiteRemaining;

    if (clockState.startTime) {
      if (clockState.player === "black") {
        // update white remaining time
        whiteRemaining -=
          new Date().getTime() -
          clockState.startTime.getTime() +
          clockState.increment;
      } else {
        // update black remaining time
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
    setClockState({
      ...clockState,
      sound: isOn,
    });
  };
  const finishedMove = (player: "white" | "black") => {
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
    if (clockState.startTime) {
      if (player === "white") {
        whiteRemaining =
          whiteRemaining -
          (new Date().getTime() - clockState.startTime?.getTime()) +
          clockState.increment;
      } else {
        blackRemaining =
          blackRemaining -
          (new Date().getTime() - clockState.startTime?.getTime()) +
          clockState.increment;
      }
      if (clockState.sound) {
        const audio = new Audio(document.location.href + "/click.mp3");
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
    });
  };

  const handleClosePreset = (preset: string) => {
    // reset game
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
        return activeColor;
      }
      return defaultColor;
    },
    [clockState.player]
  );

  return (
    <Container maxWidth="sm" disableGutters className="prevent-select">
      <Box
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="stretch"
      >
        <StyledBox
          sx={{
            backgroundColor: getColor("black"),
            transform: "rotate(180deg)",
            cursor: clockState.player === "black" ? "pointer" : "default",
          }}
          onClick={() => finishedMove("black")}
        >
          <PresetBox className="prevent-select">{clockState.preset}</PresetBox>
          <Timer
            resetToken={clockState.startTime}
            time={clockState.whiteRemaining}
            ticking={
              clockState.started &&
              !clockState.paused &&
              clockState.player === "black"
            }
          ></Timer>
          <MoveBox>Moves: {Math.max(0, clockState.moveCount - 1)}</MoveBox>
        </StyledBox>
        <ControlBox>
          <IconButton>
            <RestartAltIcon color="error" onClick={resetClock} />
          </IconButton>
          {clockState.started && !clockState.paused && (
            <IconButton>
              <PauseIcon color="warning" onClick={stopClock} />
            </IconButton>
          )}
          {(!clockState.started || clockState.paused) && (
            <IconButton>
              <PlayArrowIcon color="primary" onClick={startGame} />
            </IconButton>
          )}
          <IconButton>
            <TuneIcon color="primary" onClick={() => setOpen(true)} />
          </IconButton>
          {clockState.sound && (
            <IconButton>
              <VolumeUpIcon
                color="primary"
                onClick={() => setSoundOnOff(false)}
              />
            </IconButton>
          )}
          {!clockState.sound && (
            <IconButton>
              <VolumeOffIcon
                color="error"
                onClick={() => setSoundOnOff(true)}
              />
            </IconButton>
          )}
        </ControlBox>
        <StyledBox
          sx={{
            backgroundColor: getColor("white"),
            cursor: clockState.player === "white" ? "pointer" : "default",
          }}
          onClick={() => finishedMove("white")}
        >
          <PresetBox>{clockState.preset}</PresetBox>
          <Timer
            resetToken={clockState.startTime}
            time={clockState.blackRemaining}
            ticking={
              clockState.started &&
              !clockState.paused &&
              clockState.player === "white"
            }
          ></Timer>
          <MoveBox>Moves: {Math.max(clockState.moveCount, 0)}</MoveBox>
        </StyledBox>
      </Box>
      <ToastContainer theme="colored" autoClose={1000} limit={1} />
      <PresetDialog
        open={open}
        onClose={handleClosePreset}
        selectedValue={clockState.preset}
      />
    </Container>
  );
}

export default App;
