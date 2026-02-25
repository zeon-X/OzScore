import EmptyView from "@/components/EmptyView";
import FilterBottomSheet from "@/components/FilterBottomSheet";
import LoadingView from "@/components/LoadingView";
import MatchCard from "@/components/MatchCard";
import { Colors } from "@/constants/theme";
import { useMatches } from "@/hooks/useMatches";
import { useTournaments } from "@/hooks/useTournaments";
import { useFilterStore } from "@/store/filterStore";
import { Match } from "@/types/match";
import { MatchQueryParams } from "@/types/query";
import BottomSheet from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MatchListScreen() {
  const { tournamentIds, toggleTournament } = useFilterStore();
  const { data: tournamentsData } = useTournaments();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const openFilters = () => {
    bottomSheetRef.current?.expand();
  };

  const filters = {
    status: "all",
  };
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useMatches(filters as MatchQueryParams);

  // Flatten paginated data
  const matches = useMemo(() => {
    return data?.pages.flatMap((page) => page.matches) ?? [];
  }, [data]);

  // Get week dates around selected date
  const weekDates = useMemo(() => {
    const dates = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - 3);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [selectedDate]);

  // Get selected tournament names
  const selectedTournaments = useMemo(() => {
    if (!tournamentsData) return [];
    const allTournaments = tournamentsData.flatMap((sport: any) =>
      sport.tournaments.map((t: any) => ({ id: t.id, name: t.name })),
    );
    return allTournaments.filter((t: any) => tournamentIds.includes(t.id));
  }, [tournamentsData, tournamentIds]);

  const renderItem = useCallback(
    ({ item }: { item: Match }) => <MatchCard match={item} />,
    [],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const footer = isFetchingNextPage ? (
    <ActivityIndicator style={{ marginVertical: 16 }} />
  ) : null;

  if (isLoading) return <LoadingView />;

  if (isError)
    return (
      <EmptyView
        title="Something went wrong"
        buttonLabel="Retry"
        onPress={refetch}
      />
    );

  if (!matches.length) return <EmptyView title="No matches available" />;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];

  return (
    <SafeAreaView style={styles.container}>
      {/* Date Calendar Strip */}
      <View style={styles.dateSection}>
        <Text style={styles.monthYear}>
          {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()} ▼
        </Text>
        <View style={styles.datesRow}>
          {weekDates.map((date, index) => {
            const isSelected =
              date.toDateString() === selectedDate.toDateString();
            return (
              <TouchableOpacity
                key={index}
                style={styles.dateItem}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={styles.dayName}>{dayNames[date.getDay()]}</Text>
                <View
                  style={[
                    styles.dateCircle,
                    isSelected && styles.dateCircleSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateText,
                      isSelected && styles.dateTextSelected,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Filter Chips Row */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          <TouchableOpacity style={styles.filtersButton} onPress={openFilters}>
            <Text style={styles.filtersButtonText}>Filters</Text>
            <Text style={styles.filterIcon}>≡</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              tournamentIds.length === 0 && styles.filterChipActive,
            ]}
            onPress={() => {
              // Clear all tournament filters
              selectedTournaments.forEach((t: any) => toggleTournament(t.id));
            }}
          >
            <Text
              style={[
                styles.filterChipText,
                tournamentIds.length === 0 && styles.filterChipTextActive,
              ]}
            >
              All
            </Text>
            {tournamentIds.length === 0 && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>

          {selectedTournaments.map((tournament: any) => (
            <TouchableOpacity
              key={tournament.id}
              style={[styles.filterChip, styles.filterChipActive]}
              onPress={() => toggleTournament(tournament.id)}
            >
              <Text
                style={[styles.filterChipText, styles.filterChipTextActive]}
              >
                {tournament.name}
              </Text>
              <Text style={styles.checkmark}>✓</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlashList<Match>
        data={matches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        removeClippedSubviews
        onEndReachedThreshold={0.3}
        onEndReached={handleEndReached}
        ListFooterComponent={footer}
        showsVerticalScrollIndicator={true}
      />
      <FilterBottomSheet ref={bottomSheetRef} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  dateSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  datesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateItem: {
    alignItems: "center",
    gap: 4,
  },
  dayName: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  dateCircleSelected: {
    backgroundColor: Colors.tint,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  dateTextSelected: {
    color: Colors.background,
  },
  filterSection: {
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filtersButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    gap: 6,
  },
  filtersButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  filterIcon: {
    fontSize: 16,
    color: Colors.text,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.tint,
    borderColor: Colors.tint,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  filterChipTextActive: {
    color: Colors.background,
  },
  checkmark: {
    fontSize: 12,
    color: Colors.background,
    fontWeight: "700",
  },
});
