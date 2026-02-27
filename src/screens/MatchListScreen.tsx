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
import { LeagueTournament, SportLeague } from "@/types/sport";
import { MaterialIcons } from "@expo/vector-icons";
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
import DateSelectDropdown from "../components/DateSelectDropdown";

export default function MatchListScreen() {
  const { tournamentIds, setTournamentIds } = useFilterStore();
  const { data: tournamentsData } = useTournaments();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDateFilter, setSelectedDateFilter] = useState<Date | null>(
    new Date(),
  );
  const [isAllStatusSelected, setIsAllStatusSelected] = useState(true);

  const formattedSelectedDate = useMemo(() => {
    if (!selectedDateFilter) {
      return undefined;
    }

    const year = selectedDateFilter.getFullYear();
    const month = String(selectedDateFilter.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDateFilter.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [selectedDateFilter]);

  const handleDateChangeFromPicker = (date: Date) => {
    setCalendarDate(date);
    setSelectedDateFilter(date);
  };

  const toggleDateFilter = (date: Date) => {
    const isAlreadySelected =
      selectedDateFilter?.toDateString() === date.toDateString();

    setCalendarDate(date);

    if (isAlreadySelected) {
      setSelectedDateFilter(null);
      return;
    }

    setSelectedDateFilter(date);
  };

  const openFilters = () => {
    bottomSheetRef.current?.expand();
  };

  const filters = useMemo<MatchQueryParams>(
    () => ({
      status: isAllStatusSelected ? "all" : undefined,
      todate: formattedSelectedDate,
      tournamentIds,
    }),
    [formattedSelectedDate, isAllStatusSelected, tournamentIds],
  );
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useMatches(filters);

  // Flatten paginated data
  const matches = useMemo(() => {
    return data?.pages.flatMap((page) => page.matches) ?? [];
  }, [data]);

  // Get week dates around selected date
  const weekDates = useMemo(() => {
    const dates = [];
    const startOfWeek = new Date(calendarDate);
    startOfWeek.setDate(calendarDate.getDate() - 3);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [calendarDate]);

  // Get selected tournament names
  const selectedTournaments = useMemo(() => {
    if (!tournamentsData) return [];
    const allTournaments = tournamentsData.flatMap((sport: SportLeague) =>
      sport.tournaments.map((t: LeagueTournament) => ({
        id: t.id,
        name: t.name,
      })),
    );
    return allTournaments.filter((t) => tournamentIds.includes(t.id));
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

  const dayNames = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.querySection}>
        {/* Date Calendar Strip */}
        <View style={styles.dateSection}>
          <DateSelectDropdown
            selectedDate={calendarDate}
            onDateChange={handleDateChangeFromPicker}
          />
          <View style={styles.datesRow}>
            {weekDates.map((date, index) => {
              const isSelected =
                selectedDateFilter?.toDateString() === date.toDateString();
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.dateItem}
                  onPress={() => toggleDateFilter(date)}
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
            <TouchableOpacity
              style={styles.filtersButton}
              onPress={openFilters}
            >
              <Text style={styles.filtersButtonText}>Filters</Text>
              <MaterialIcons name="tune" size={16} color={Colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                isAllStatusSelected && styles.filterChipActive,
              ]}
              onPress={() => setIsAllStatusSelected((prev) => !prev)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isAllStatusSelected && styles.filterChipTextActive,
                ]}
              >
                All
              </Text>
              {isAllStatusSelected && (
                <View style={styles.chipIconWrap}>
                  <MaterialIcons name="close" size={12} color={Colors.tint} />
                </View>
              )}
            </TouchableOpacity>

            {selectedTournaments.map((tournament) => (
              <TouchableOpacity
                key={tournament.id}
                style={[styles.filterChip, styles.filterChipActive]}
                onPress={() =>
                  setTournamentIds(
                    tournamentIds.filter((id) => id !== tournament.id),
                  )
                }
              >
                <Text
                  style={[styles.filterChipText, styles.filterChipTextActive]}
                >
                  {tournament.name}
                </Text>
                <View style={styles.chipIconWrap}>
                  <MaterialIcons name="close" size={12} color={Colors.tint} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={styles.listSection}>
        {isLoading ? (
          <LoadingView />
        ) : isError ? (
          <EmptyView
            title="Something went wrong"
            buttonLabel="Retry"
            onPress={refetch}
          />
        ) : !matches.length ? (
          <EmptyView title="No matches available" />
        ) : (
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
        )}
      </View>
      <FilterBottomSheet ref={bottomSheetRef} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listSection: {
    flex: 1,
  },
  querySection: { borderBottomWidth: 6, borderBottomColor: Colors.border },
  dateSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  chipIconWrap: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
