import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { IconButton, ListItemIcon, Stack, TextField } from "@mui/material";

const presets = [
  "1 min",
  "3 min",
  "3 min | 2 sec",
  "5 min | 3 sec",
  "10 min | 5 sec",
  "15 min | 15 sec",
  "30 min | 30 sec",
  "60 min | 30 sec",
  "90 min | 30 sec",
];

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

export function PresetDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open } = props;
  const [min, setMin] = React.useState("10");
  const [sec, setSec] = React.useState("5");

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };
  const setCustomHanle = () => {
    onClose(`${min} min | ${sec} sec`);
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth>
      <DialogTitle>Change timer</DialogTitle>
      <List sx={{ pt: 0 }}>
        {presets.map((preset) => (
          <ListItem disableGutters key={preset} sx={{ padding: 0 }}>
            <ListItemButton
              onClick={() => handleListItemClick(preset)}
              key={preset}
            >
              <ListItemIcon>
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText primary={preset} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Stack direction="row" sx={{ padding: "2rem" }} spacing={3}>
        <TextField
          label="Min"
          value={min}
          type="number"
          onChange={(e) => setMin(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          variant="standard"
        />

        <TextField
          onChange={(e) => setSec(e.target.value)}
          value={sec}
          label="Sec"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="standard"
        />
        <IconButton onClick={setCustomHanle}>
          <ExitToAppIcon />
        </IconButton>
      </Stack>
    </Dialog>
  );
}
