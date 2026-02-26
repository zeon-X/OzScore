import { Colors } from "@/constants/theme";
import { useTournaments } from "@/hooks/useTournaments";
import { useFilterStore } from "@/store/filterStore";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FilterBottomSheet = forwardRef<BottomSheet>((_, ref) => {
  const { data } = useTournaments();
  const { tournamentIds, toggleTournament, resetFilters } = useFilterStore();
  const insets = useSafeAreaInsets();
  const [expandedSportIds, setExpandedSportIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // const [headerHeight, setHeaderHeight] = useState(0);
  const [resetHeight, setResetHeight] = useState(0);
  const [actionsHeight, setActionsHeight] = useState(0);

  const [scrollHeight, setScrollHeight] = useState(0);

  const snapPoints = useMemo(() => ["94%"], []);

  const fallbackContainerHeight = useMemo(
    () => Dimensions.get("window").height * 0.94,
    [],
  );

  useEffect(() => {
    if (data?.length) {
      setExpandedSportIds([data[0].id]);
    }
  }, [data]);

  useEffect(() => {
    if (!resetHeight || !actionsHeight) {
      return;
    }

    setScrollHeight(
      Math.max(fallbackContainerHeight - (resetHeight + actionsHeight), 0),
    );
  }, [fallbackContainerHeight, resetHeight, actionsHeight]);

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
      backgroundStyle={{ backgroundColor: "#888888" }}
      handleIndicatorStyle={{ backgroundColor: Colors.background }}
      // style={{ flex: 1, borderWidth: 1, borderColor: "red" }}
    >
      <BottomSheetView style={styles.container}>
        <View
          style={styles.header}
          // onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
        >
          <Text style={styles.headerTitle}>FILTERS</Text>
          <TouchableOpacity onPress={closeSheet}>
            <MaterialIcons name="close" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View
          style={styles.resetRow}
          onLayout={(event) => setResetHeight(event.nativeEvent.layout.height)}
        >
          <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
            <MaterialIcons name="restart-alt" size={16} color={Colors.tint} />
            <Text style={styles.resetAllText}>Reset all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={[styles.scroll, { height: scrollHeight }]}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 74 + Math.max(insets.bottom, 10) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {data?.map((sport: any) => {
            // console.log(sport);

            return (
              <View key={sport.id} style={styles.sportCard}>
                <TouchableOpacity
                  style={styles.sportHeaderRow}
                  onPress={() => toggleSportExpand(sport.id)}
                >
                  <View style={styles.sportLeftRow}>
                    <MaterialIcons
                      name={
                        expandedSportIds.includes(sport.id)
                          ? "expand-less"
                          : "expand-more"
                      }
                      size={18}
                      color={Colors.textMuted}
                    />
                    <Text style={styles.sportTitle}>{sport.sportName}</Text>
                  </View>
                  <View style={styles.selectedBadge}>
                    {sport.tournaments.every((t: any) =>
                      tournamentIds.includes(t.id),
                    ) ? (
                      <MaterialIcons
                        name="check"
                        size={12}
                        color={Colors.background}
                      />
                    ) : null}
                  </View>
                </TouchableOpacity>

                {expandedSportIds.includes(sport.id) ? (
                  <View style={styles.expandedContent}>
                    <View style={styles.searchRow}>
                      <MaterialIcons
                        name="search"
                        size={18}
                        color={Colors.textMuted}
                      />
                      <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search"
                        placeholderTextColor={Colors.textMuted}
                        style={styles.searchInput}
                      />
                    </View>

                    {sport.tournaments
                      .filter((t: any) =>
                        t.name
                          .toLowerCase()
                          .includes(searchQuery.trim().toLowerCase()),
                      )
                      .map((t: any) => {
                        const selected = tournamentIds.includes(t.id);

                        // console.log(t);

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
                              {selected ? (
                                <MaterialIcons
                                  name="check"
                                  size={12}
                                  color={Colors.background}
                                />
                              ) : null}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                  </View>
                ) : null}
              </View>
            );
          })}
        </ScrollView>

        <View
          style={[
            styles.actions,
            { paddingBottom: Math.max(insets.bottom, 10) },
          ]}
          onLayout={(event) =>
            setActionsHeight(event.nativeEvent.layout.height)
          }
        >
          <TouchableOpacity style={styles.apply} onPress={closeSheet}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>
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
    height: 64,
    backgroundColor: Colors.headerBackground,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: Colors.background,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -1,
  },
  closeText: {
    color: Colors.textMuted,
    fontSize: 20,
    fontWeight: "600",
  },

  resetRow: {
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  resetAllText: {
    color: Colors.tint,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  scrollContent: {
    paddingBottom: 10,
    gap: 8,
  },
  sportCard: {
    backgroundColor: "#E0DFE9",
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sportHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  sportLeftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
    // padding: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 6,
    color: Colors.text,
  },
  searchRow: {
    height: 40,
    marginHorizontal: 10,
    marginBottom: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tournamentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 44,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
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
  actions: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  apply: {
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.button,
  },
  applyText: {
    color: Colors.buttonText,
    fontWeight: "600",
  },
});
