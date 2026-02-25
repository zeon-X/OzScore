import { Colors } from "@/constants/theme";
import { useTournaments } from "@/hooks/useTournaments";
import { useFilterStore } from "@/store/filterStore";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const FilterBottomSheet = forwardRef<BottomSheet>((_, ref) => {
  const { data } = useTournaments();
  const { tournamentIds, toggleTournament, resetFilters } = useFilterStore();

  const snapPoints = useMemo(() => ["70%"], []);

  return (
    <BottomSheet ref={ref} index={-1} snapPoints={snapPoints}>
      <View style={styles.container}>
        <ScrollView>
          {data?.map((sport: any) => (
            <View key={sport.id}>
              <Text style={styles.sportTitle}>{sport.sportName}</Text>

              {sport.tournaments.map((t: any) => {
                const selected = tournamentIds.includes(t.id);

                return (
                  <TouchableOpacity
                    key={t.id}
                    style={styles.tournamentRow}
                    onPress={() => toggleTournament(t.id)}
                  >
                    <Text>{t.name}</Text>
                    <Text>{selected ? "✓" : ""}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.reset} onPress={resetFilters}>
            <Text>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
});

FilterBottomSheet.displayName = "FilterBottomSheet";

export default FilterBottomSheet;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  sportTitle: {
    fontWeight: "600",
    marginVertical: 8,
  },
  tournamentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  actions: {
    paddingVertical: 10,
  },
  reset: {
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.surface,
  },
});
