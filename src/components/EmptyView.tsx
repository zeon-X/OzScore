import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  title: string;
  buttonLabel?: string;
  onPress?: () => void;
}

export default function EmptyView({ title, buttonLabel, onPress }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>

      {buttonLabel && (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.button,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.buttonText,
    fontWeight: "600",
  },
});
