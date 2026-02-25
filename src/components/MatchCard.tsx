import { MEDIA_BASE_URL } from "@/constants/config";
import { Colors, OzScoreTheme } from "@/constants/theme";
import { Match } from "@/types/match";
import React, { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import CountdownTimer from "./CountdownTimer";

interface Props {
  match: Match;
}

function MatchCard({ match }: Props) {
  const startTime = new Date(match.start_time);

  return (
    <View style={styles.card}>
      {/* Tournament */}
      <Text style={styles.tournament}>{match.tournament.name}</Text>

      {/* Start Time */}
      <Text style={styles.time}>
        {startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>

      {/* Teams */}
      <View style={styles.teamRow}>
        <TeamBlock name={match.homeTeam.name} logo={match.homeTeam.logo} />

        <Text style={styles.vs}>VS</Text>

        <TeamBlock name={match.awayTeam.name} logo={match.awayTeam.logo} />
      </View>

      {/* Countdown */}
      <View style={styles.countdownContainer}>
        <CountdownTimer startTime={match.start_time} />
      </View>
    </View>
  );
}

const TeamBlock = ({ name, logo }: { name: string; logo: string | null }) => {
  return (
    <View style={styles.teamBlock}>
      {logo ? (
        <Image
          source={{ uri: MEDIA_BASE_URL + logo }}
          style={styles.logo}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.logoPlaceholder} />
      )}

      <Text style={styles.teamName} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};

export default memo(MatchCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 14,
  },

  tournament: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },

  time: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },

  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  teamBlock: {
    flex: 1,
    alignItems: "center",
  },

  logo: {
    width: 40,
    height: 40,
    marginBottom: 6,
  },

  logoPlaceholder: {
    width: 40,
    height: 40,
    marginBottom: 6,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },

  teamName: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },

  vs: {
    marginHorizontal: 10,
    fontWeight: "600",
    fontSize: 14,
    color: Colors.textMuted,
  },

  countdownContainer: {
    marginTop: 14,
    alignItems: "center",
    backgroundColor: OzScoreTheme.chipBackground,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
