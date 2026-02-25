import EmptyView from "@/components/EmptyView";
import LoadingView from "@/components/LoadingView";
import MatchCard from "@/components/MatchCard";
import { Colors } from "@/constants/theme";
import { useMatches } from "@/hooks/useMatches";
import { Match } from "@/types/match";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MatchListScreen() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useMatches();

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
      <FlashList<Match>
        data={matches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        removeClippedSubviews
        onEndReachedThreshold={0.3}
        onEndReached={handleEndReached}
        ListFooterComponent={footer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
