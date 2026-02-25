import { OzScoreTheme } from "@/constants/theme";
import { useGlobalClock } from "@/hooks/useGlobalClock";
import { differenceInSeconds } from "date-fns";
import React, { memo } from "react";
import { StyleSheet, Text } from "react-native";

interface Props {
  startTime: string;
}

function formatUnit(value: number) {
  return value.toString().padStart(2, "0");
}

function CountdownTimer({ startTime }: Props) {
  const now = useGlobalClock();

  const remaining = differenceInSeconds(new Date(startTime), new Date(now));

  if (remaining <= 0) {
    return <Text style={styles.live}>LIVE</Text>;
  }

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return (
    <Text style={styles.timer}>
      {formatUnit(hours)}:{formatUnit(minutes)}:{formatUnit(seconds)}
    </Text>
  );
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
