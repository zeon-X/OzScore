import { Colors } from "@/constants/theme";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function LoadingView() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.tint} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
