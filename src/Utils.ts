export function formatTime(totalMs: number) {
  const totalSeconds = Math.floor(totalMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (totalMs < 60000) {
    // if less than a minute, show seconds with 1 decimal place
    return `${seconds}.${Math.floor(totalMs / 100) % 10}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function parsePreset(preset: string) {
  const match = preset.replace("min", "").replace("sec", "").split("|") as any;

  return {
    blackRemaining: match[0] * 60000,
    whiteRemaining: match[0] * 60000,
    increment: (match[1] || 0) * 1000,
    preset,
  };
}
