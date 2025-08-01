import type {WeatherData} from "@/api/types.ts";
import {useFavorite} from "@/hooks/use-favorite.ts";
import {Button} from "@/components/ui/button.tsx";
import {Star} from "lucide-react";
import {toast} from "sonner";

interface FavoriteButtonProps {
    data: WeatherData;
}

export default function FavoriteButton({data}: FavoriteButtonProps) {
    const {isFavorite, favorites, addToFavorite, removeFromFavorite} = useFavorite()
    const isCurrentFavorite = isFavorite(data.coord.lat, data.coord.lon);

    const handleToggleFavorite = () => {
        if (isCurrentFavorite) {
            removeFromFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`);
            toast.error(`Removed ${data.name} from favorites.`);
        } else {
            addToFavorite.mutate({
                name: data.name,
                lat: data.coord.lat,
                lon: data.coord.lon,
                country: data.sys.country,
            });
            toast.success(`Added ${data.name} to favorites.`);
        }
    }

    return (
        <Button
            variant={isCurrentFavorite ? 'default' : 'outline'}
            size='icon'
            className={`${isCurrentFavorite} ? 'bg-yellow-500 hover:bg-yellow-600' : ''`}
            onClick={handleToggleFavorite}
        >
            <Star className={`h-4 w-4 ${isCurrentFavorite ? 'fill-current' : ''}`}/>
        </Button>
    );
}