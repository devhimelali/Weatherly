import {useLocalStorage} from "@/hooks/use-local-storage.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

interface FavoriteCity {
    id: string,
    name: string,
    lat: number,
    lon: number,
    country: string,
    state?: string,
    addedAt: number
}

export function useFavorite() {
    const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>("favorites", []);

    const queryClient = useQueryClient();

    const favoritesQuery = useQuery({
        'queryKey': ['favorites'],
        queryFn: () => favorites,
        initialData: favorites,
        staleTime: Infinity
    });

    const addToFavorite = useMutation({
        mutationFn: async (city: Omit<FavoriteCity, "id" | "addedAt">) => {
            const newFavorite: FavoriteCity = {
                ...city,
                id: `${city.lat}-${city.lon}`,
                addedAt: Date.now(),
            };

            const exists = favorites.some((fav) => fav.id === newFavorite.id);

            if (exists) {
                return favorites;
            }

            const newFavorites = [...favorites, newFavorite].slice(0, 10);

            setFavorites(newFavorites);

            return newFavorites;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favorites"]
            })
        }
    });

    const removeFromFavorite = useMutation({
        mutationFn: async (id: string) => {
            const newFavorites = favorites.filter((fav) => fav.id !== id);
            setFavorites(newFavorites);
            return newFavorites;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favorites"]
            })
        }
    });

    return {
        favorites: favoritesQuery.data,
        addToFavorite,
        removeFromFavorite,
        isFavorite: (lat: number, lon: number) => favorites.some((city) => city.lat === lat && city.lon === lon)
    }
}