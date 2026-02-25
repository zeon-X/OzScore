import { Colors } from "@/constants/theme";
import { useTournaments } from "@/hooks/useTournaments";
import { useFilterStore } from "@/store/filterStore";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FilterBottomSheet = forwardRef<BottomSheet>((_, ref) => {
  const { data } = useTournaments();
  const { tournamentIds, toggleTournament, resetFilters } = useFilterStore();
  const [expandedSportIds, setExpandedSportIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const snapPoints = useMemo(() => ["90%", "70%", "40%"], []);

  useEffect(() => {
    if (data?.length) {
      setExpandedSportIds([data[0].id]);
    }
  }, [data]);

  const closeSheet = () => {
    if (!ref || typeof ref === "function") {
      return;
    }

    ref.current?.close();
  };

  const toggleSportExpand = (sportId: number) => {
    setExpandedSportIds((prev) =>
      prev.includes(sportId)
        ? prev.filter((id) => id !== sportId)
        : [...prev, sportId],
    );
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>FILTERS</Text>
          <TouchableOpacity onPress={closeSheet}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
          <View style={styles.resetRow}>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.resetAllText}>Reset all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {data?.map((sport: any) => (
              <View key={sport.id} style={styles.sportCard}>
                <TouchableOpacity
                  style={styles.sportHeaderRow}
                  onPress={() => toggleSportExpand(sport.id)}
                >
                  <View style={styles.sportLeftRow}>
                    <Text style={styles.chevron}>
                      {expandedSportIds.includes(sport.id) ? "⌃" : "⌄"}
                    </Text>
                    <Text style={styles.sportTitle}>{sport.sportName}</Text>
                  </View>
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>
                      {sport.tournaments.every((t: any) =>
                        tournamentIds.includes(t.id),
                      )
                        ? "✓"
                        : ""}
                    </Text>
                  </View>
                </TouchableOpacity>

                {expandedSportIds.includes(sport.id) ? (
                  <View style={styles.expandedContent}>
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Search"
                      placeholderTextColor={Colors.textMuted}
                      style={styles.searchInput}
                    />

                    {sport.tournaments
                      .filter((t: any) =>
                        t.name
                          .toLowerCase()
                          .includes(searchQuery.trim().toLowerCase()),
                      )
                      .map((t: any) => {
                        const selected = tournamentIds.includes(t.id);

                        return (
                          <TouchableOpacity
                            key={t.id}
                            style={styles.tournamentRow}
                            onPress={() => toggleTournament(t.id)}
                          >
                            <Text style={styles.tournamentText}>{t.name}</Text>
                            <View
                              style={[
                                styles.tournamentCheck,
                                selected && styles.tournamentCheckSelected,
                              ]}
                            >
                              <Text style={styles.tournamentCheckText}>✓</Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                  </View>
                ) : null}
              </View>
            ))}
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.apply} onPress={closeSheet}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </BottomSheetView>
    </BottomSheet>
  );
});

FilterBottomSheet.displayName = "FilterBottomSheet";

export default FilterBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 52,
    backgroundColor: Colors.tabIconSelected,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: Colors.background,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  closeText: {
    color: Colors.textMuted,
    fontSize: 20,
    fontWeight: "600",
  },
  safeArea: { flex: 1 },
  resetRow: {
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  resetAllText: {
    color: Colors.tint,
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 8,
  },
  scrollContent: {
    paddingBottom: 10,
    gap: 8,
  },
  sportCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sportHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  sportLeftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  chevron: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  sportTitle: {
    color: Colors.text,
    fontWeight: "600",
    fontSize: 18,
  },
  selectedBadge: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedBadgeText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: "700",
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 4,
  },
  searchInput: {
    height: 36,
    marginHorizontal: 10,
    marginBottom: 8,
    marginTop: 2,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    color: Colors.text,
  },
  tournamentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 44,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  tournamentText: {
    color: Colors.text,
    fontWeight: "500",
  },
  tournamentCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  tournamentCheckSelected: {
    backgroundColor: Colors.tint,
    borderColor: Colors.tint,
  },
  tournamentCheckText: {
    color: Colors.background,
    fontSize: 11,
    fontWeight: "700",
  },
  actions: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
  },
  apply: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.button,
  },
  applyText: {
    color: Colors.buttonText,
    fontWeight: "600",
  },
});
