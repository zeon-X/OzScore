import EmptyView from "@/components/EmptyView";
import FilterBottomSheet from "@/components/FilterBottomSheet";
import LoadingView from "@/components/LoadingView";
import MatchCard from "@/components/MatchCard";
import { Colors } from "@/constants/theme";
import { useMatches } from "@/hooks/useMatches";
import { useFilterStore } from "@/store/filterStore";
import { Match } from "@/types/match";
import { MatchQueryParams } from "@/types/query";
import BottomSheet from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MatchListScreen() {
  const { status, todate, tournamentIds } = useFilterStore();
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}
        onPress={openFilters}
      >
        <Text>Filters</Text>
      </TouchableOpacity>
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
});
