import { OzScoreTheme } from "@/constants/theme";
import { useGlobalClock } from "@/hooks/useGlobalClock";
import { differenceInSeconds } from "date-fns";
import React, { memo } from "react";
import { StyleSheet, Text } from "react-native";

interface Props {
  startTime: string;
}

function formatTime(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];

  if (hrs > 0) parts.push(`${hrs}h`);
  if (mins > 0 || hrs > 0) parts.push(`${mins}m`);
  parts.push(`${secs}s`);

  return parts.join(" ");
}

function CountdownTimer({ startTime }: Props) {
  const now = useGlobalClock();

  const remaining = differenceInSeconds(new Date(startTime), new Date(now));

  if (remaining <= 0) {
    return <Text style={styles.live}>LIVE</Text>;
  }

  return <Text style={styles.timer}>{formatTime(remaining)}</Text>;
}

export default memo(CountdownTimer);

const styles = StyleSheet.create({
  timer: {
    fontWeight: "600",
    color: OzScoreTheme.applyButton,
  },
  live: {
    fontWeight: "700",
    color: "#FF3B30",
  },
});
