import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList, CommandSeparator
} from "@/components/ui/command.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {Clock, Loader2, Search, Star, XCircle} from "lucide-react";
import {useLocationSearch} from "@/hooks/use-weather.ts";
import {useNavigate} from "react-router-dom";
import {useSearchHistory} from "@/hooks/use-search-history.ts";
import {format} from "date-fns";
import {useFavorite} from "@/hooks/use-favorite.ts";

export default function CitySearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const {data: locations, isLoading} = useLocationSearch(query);
    const {history, addToHistory, clearHistory} = useSearchHistory();
    const {favorites} = useFavorite()

    const handleSelectLocation = (cityData: string) => {
        const [lat, lon, name, country] = cityData.split("|");
        addToHistory.mutate({
            query,
            name,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            country,
        })
        setOpen(false);
        navigate(`/cities/${name}?lat=${lat}&lon=${lon}`);
    }

    return (
        <>
            <Button
                variant="outline"
                className="relative w-2/3 justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
                onClick={() => setOpen(true)}
            >
                <Search className="mr-2 h-4 w-4"/>
                Search Cities....
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Search cities..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    {query.length > 2 && !isLoading && <CommandEmpty>No results found.</CommandEmpty>}

                    {favorites && favorites.length > 0 && (
                        <CommandGroup heading="Favorite Cities">
                            {favorites.map((favorite) => (
                                <CommandItem
                                    key={favorite.id}
                                    value={`${favorite.lat} | ${favorite.lon} | ${favorite.name} | ${favorite.country}`}
                                    onSelect={handleSelectLocation}
                                >
                                    <Star className="mr-2 h-4 w-4 text-yellow-500"/>
                                    <span>{favorite.name}</span>
                                    {
                                        favorite.state && (
                                            <span className="text-muted-foreground">, {favorite.state}</span>
                                        )
                                    }
                                    <span className="text-muted-foreground">, {favorite.country}</span>
                                    <span
                                        className="ml-auto text-xs text-muted-foreground">{format(favorite.addedAt, "MMM d, h:mm a")}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    {history && history.length > 0 && (
                        <>
                            <CommandSeparator/>
                            <CommandGroup>
                                <div className="flex items-center justify-between px-2 my-2">
                                    <p className="text-xs text-muted-foreground">Recent Searches</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => clearHistory.mutate()}
                                    >
                                        <XCircle className="mr-2 h-4 w-4"/>
                                        Clear
                                    </Button>
                                </div>
                                {history.map((location) => (
                                    <CommandItem
                                        key={`${location.lat}-${location.lon}`}
                                        value={`${location.lat} | ${location.lon} | ${location.name} | ${location.country}`}
                                        onSelect={handleSelectLocation}
                                    >
                                        <Clock className="mr-2 h-4 w-4 text-muted-foreground"/>
                                        <span>{location.name}</span>
                                        {
                                            location.state && (
                                                <span className="text-muted-foreground">, {location.state}</span>
                                            )
                                        }
                                        <span className="text-muted-foreground">, {location.country}</span>
                                        <span
                                            className="ml-auto text-xs text-muted-foreground">{format(location.searchedAt, "MMM d, h:mm a")}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    )}

                    {locations && locations.length > 0 && (
                        <>
                            <CommandSeparator/>
                            <CommandGroup heading="Suggestions">
                                {isLoading && (
                                    <div className="flex items-center justify-center p-4">
                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                    </div>
                                )}
                                {
                                    locations.map((location) => (
                                        <CommandItem
                                            key={`${location.lat}-${location.lon}`}
                                            value={`${location.lat} | ${location.lon} | ${location.name} | ${location.country}`}
                                            onSelect={handleSelectLocation}
                                        >
                                            <Search className="mr-2 h-4 w-4"/>
                                            <span>{location.name}</span>
                                            {
                                                location.state && (
                                                    <span className="text-muted-foreground">, {location.state}</span>
                                                )
                                            }
                                            <span className="text-muted-foreground">, {location.country}</span>
                                        </CommandItem>
                                    ))
                                }
                            </CommandGroup>
                        </>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}