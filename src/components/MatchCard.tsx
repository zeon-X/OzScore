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
      <View style={styles.teamRow}>
        <TeamBlock name={match.homeTeam.name} logo={match.homeTeam.logo} />

        <View style={styles.centerBlock}>
          <Text style={styles.tournament}>{match.tournament.name}</Text>

          <Text style={styles.time}>
            {startTime
              .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              .replace(/\s/g, "")}
          </Text>

          <View style={styles.countdownContainer}>
            <CountdownTimer startTime={match.start_time} />
          </View>
        </View>

        <TeamBlock name={match.awayTeam.name} logo={match.awayTeam.logo} />
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

      <Text style={styles.teamName} numberOfLines={2}>
        {name}
      </Text>
    </View>
  );
};

export default memo(MatchCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    marginHorizontal: 12,
    // marginVertical: 6,
    paddingHorizontal: 14,
    paddingVertical: 14,
    // borderRadius: 10,
    borderBottomColor: OzScoreTheme.divider,
    borderBottomWidth: 1,
  },

  tournament: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
    textTransform: "uppercase",
    fontWeight: "500",
  },

  time: {
    fontSize: 44,
    fontFamily: "BebasNeue_400Regular",
    textAlign: "center",

    color: Colors.text,
  },

  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  teamBlock: {
    flex: 1,
    alignItems: "center",
    maxWidth: "30%",
  },

  centerBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    minWidth: "40%",
  },

  logo: {
    width: 34,
    height: 34,
    marginBottom: 8,
  },

  logoPlaceholder: {
    width: 34,
    height: 34,
    marginBottom: 8,
    borderRadius: 17,
    backgroundColor: OzScoreTheme.chipBackground,
  },

  teamName: {
    fontSize: 10,
    fontWeight: "400",
    textAlign: "center",
    color: Colors.text,
  },

  countdownContainer: {
    marginTop: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
