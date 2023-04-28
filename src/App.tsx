import React from "react";
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

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#E7EBEF",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  height: "45vh",
  color: theme.palette.text.secondary,
  justifyContent: "center",
  position: "relative",
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
}));

const PresetBox = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.secondary,
  position: "absolute",
}));

const MoveBox = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.secondary,
  position: "absolute",
  bottom: "2rem",
  right: "2rem",
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
    toast("Game started");
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
    setClockState({
      ...clockState,
      player: "",
      moveCount: 0,
      paused: true,
      started: false,
    });
    // update remaining time
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
        // update white remaining time
        whiteRemaining =
          whiteRemaining -
          (new Date().getTime() - clockState.startTime?.getTime()) +
          clockState.increment;
      } else {
        // update black remaining time
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

  return (
    <Container maxWidth="sm" disableGutters>
      <Box height="100vh" display="flex" flexDirection="column">
        <StyledBox
          sx={{
            backgroundColor:
              clockState.player === "white" ? activeColor : defaultColor,
          }}
          onClick={() => finishedMove("white")}
        >
          <PresetBox sx={{ top: "1rem" }}>{clockState.preset}</PresetBox>
          <Timer
            resetToken={clockState.startTime}
            time={clockState.whiteRemaining}
            ticking={clockState.started && clockState.player === "white"}
          ></Timer>
          <MoveBox>Moves: {clockState.moveCount}</MoveBox>
        </StyledBox>
        <ControlBox>
          <RestartAltIcon color="primary" onClick={resetClock} />
          {clockState.started && (
            <PauseIcon color="primary" onClick={stopClock} />
          )}
          {!clockState.started && (
            <PlayArrowIcon color="primary" onClick={startGame} />
          )}
          <TuneIcon color="primary" onClick={() => setOpen(true)} />
          {clockState.sound && (
            <VolumeUpIcon
              color="primary"
              onClick={() => setSoundOnOff(false)}
            />
          )}
          {!clockState.sound && (
            <VolumeOffIcon
              color="primary"
              onClick={() => setSoundOnOff(true)}
            />
          )}
        </ControlBox>
        <StyledBox
          sx={{
            backgroundColor:
              clockState.player === "black" ? activeColor : defaultColor,
          }}
          onClick={() => finishedMove("black")}
        >
          <PresetBox sx={{ bottom: "2rem" }}>{clockState.preset}</PresetBox>
          <Timer
            resetToken={clockState.startTime}
            time={clockState.blackRemaining}
            ticking={clockState.started && clockState.player === "black"}
          ></Timer>
          <MoveBox sx={{ left: "2rem", top: "1rem", right: "initial" }}>
            Moves: {Math.max(clockState.moveCount - 1, 0)}
          </MoveBox>
        </StyledBox>
      </Box>
      <ToastContainer theme="colored" />
      <PresetDialog
        open={open}
        onClose={handleClosePreset}
        selectedValue={clockState.preset}
      />
    </Container>
  );
}

export default App;
