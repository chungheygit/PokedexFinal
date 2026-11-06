import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Alert } from 'react-native';

import { addFavorite, type Favorite, getFavorites, removeFavorite } from '@/services/favorites';

export type { Favorite };

const FAVORITES_KEY = ['favorites'];

/**
 * Only the app writes the table, so the data never goes stale on its own.
 * No retries: a database that failed to open will not open a second later;
 * "Try again" refetches, which opens it again.
 */
const favoritesQuery = queryOptions({
  queryKey: FAVORITES_KEY,
  queryFn: getFavorites,
  staleTime: Infinity,
  retry: false,
});

/** All favorites, newest first. */
export function useFavorites() {
  return useQuery(favoritesQuery);
}

/**
 * Whether this Pokémon is a favorite, from the same cache as `useFavorites`
 * (no second SQL query). `undefined` while loading, after an error, or while
 * the id is unknown, so callers can tell "no" from "not known yet".
 */
export function useIsFavorite(id: number | undefined): boolean | undefined {
  const select = useCallback(
    (favorites: Favorite[]) => favorites.some((favorite) => favorite.id === id),
    [id],
  );
  const query = useQuery({ ...favoritesQuery, select });
  return id === undefined || query.isError ? undefined : query.data;
}

export type SetFavoriteInput = {
  id: number;
  /** API slug. */
  name: string;
  /** The state to end in, not a toggle. */
  favorite: boolean;
};

type SetFavoriteVariables = SetFavoriteInput & { createdAt: number };

/**
 * Adds or removes a favorite. The cache changes at once (optimistic), so the
 * Favorites tab, the options menu and the heart button update together; on
 * failure the old list comes back and an alert explains it.
 *
 * Returns a stable function. Pass the state to end in: the caller reads the
 * current state and asks for the opposite, so fast taps end where expected.
 */
export function useSetFavorite(): (input: SetFavoriteInput) => void {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: FAVORITES_KEY,
    mutationFn: ({ id, name, favorite, createdAt }: SetFavoriteVariables) =>
      favorite ? addFavorite({ id, name, createdAt }) : removeFavorite(id),
    onMutate: async ({ id, name, favorite, createdAt }) => {
      // A fetch finishing now would overwrite the optimistic list.
      await queryClient.cancelQueries({ queryKey: FAVORITES_KEY });
      const previous = queryClient.getQueryData<Favorite[]>(FAVORITES_KEY);
      queryClient.setQueryData<Favorite[]>(FAVORITES_KEY, (favorites) => {
        if (!favorites) return favorites;
        const others = favorites.filter((item) => item.id !== id);
        return favorite ? [{ id, name, createdAt }, ...others] : others;
      });
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(FAVORITES_KEY, context.previous);
      }
      Alert.alert('Could not save', 'Your favorites were not changed. Please try again.');
    },
    onSettled: () => {
      // Only after the last of several quick taps (this one still counts as
      // running), so the list does not flicker between their results.
      if (queryClient.isMutating({ mutationKey: FAVORITES_KEY }) === 1) {
        return queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
      }
    },
  });

  // One timestamp for the optimistic item and the saved row, so nothing
  // reorders when the database answers.
  return useCallback((input: SetFavoriteInput) => mutate({ ...input, createdAt: Date.now() }), [mutate]);
}
