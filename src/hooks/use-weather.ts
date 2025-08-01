import type {Coordinates} from "@/api/types.ts";
import {useQuery} from "@tanstack/react-query";
import {weatherAPI} from "@/api/weather.ts";


export const WEATHERY_KEY = {
    weather: (coords: Coordinates) => ["weather", coords] as const,
    forecast: (coords: Coordinates) => ["forecast", coords] as const,
    location: (coords: Coordinates) => ["location", coords] as const,
    search: (query: string) => ["location-search", query] as const
} as const;

export function useWeatherQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHERY_KEY.weather(coordinates ?? {lat: 0, lon: 0}),
        queryFn: () => coordinates ? weatherAPI.getCurrentWeather(coordinates) : null,
        enabled: !!coordinates
    })
}

export function useForecastQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHERY_KEY.forecast(coordinates ?? {lat: 0, lon: 0}),
        queryFn: () => coordinates ? weatherAPI.getForecast(coordinates) : null,
        enabled: !!coordinates
    })
}

export function useReverseGeocodeQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHERY_KEY.location(coordinates ?? {lat: 0, lon: 0}),
        queryFn: () => coordinates ? weatherAPI.reverseGeocode(coordinates) : null,
        enabled: !!coordinates
    })
}

export function useLocationSearch(query: string) {
    return useQuery({
        queryKey: WEATHERY_KEY.search(query),
        queryFn: () => weatherAPI.searchLocations(query),
        enabled: query.length >= 3
    })
}