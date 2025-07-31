import {Button} from "@/components/ui/button.tsx";
import {AlertCircle, MapPin, RefreshCw} from "lucide-react";
import {useGeolocation} from "@/hooks/use-geolocation.ts";
import LoadingSkeleton from "@/components/loading-skeleton.tsx";
import CurrentWeather from "@/components/CurrentWeather.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {useForecastQuery, useReverseGeocodeQuery, useWeatherQuery} from "@/hooks/use-weather.ts";

export default function WeatherDashboard() {
    const {coordinates, getLocation, error: locationError, isLoading: locationLoading} = useGeolocation();

    const weatherQuery = useWeatherQuery(coordinates)
    const forecastQuery = useForecastQuery(coordinates)
    const locationQuery = useReverseGeocodeQuery(coordinates)

    const handleRefresh = () => {
        getLocation();

        if (coordinates) {
            weatherQuery.refetch();
            forecastQuery.refetch();
            locationQuery.refetch();
        }
    }

    if (locationLoading) {
        return <LoadingSkeleton/>
    }

    if (locationError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="w-4 h-4"/>
                <AlertTitle>Location Error</AlertTitle>
                <AlertDescription className="flex flex-col gap-4">
                    <p>{locationError}</p>
                    <Button variant={"outline"} className="w-fit" onClick={getLocation}>
                        <MapPin className="mr-2 h-4 w-4"/>
                        Enable Location
                    </Button>
                </AlertDescription>
            </Alert>
        )
    }

    if (!coordinates) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Location Required</AlertTitle>
                <AlertDescription className="flex flex-col gap-4">
                    <p>Please enable your location to use this feature</p>
                    <Button variant={"outline"} className="w-fit" onClick={getLocation}>
                        <MapPin className="mr-2 h-4 w-4"/>
                        Enable Location
                    </Button>
                </AlertDescription>
            </Alert>
        )
    }

    const locationName = locationQuery.data?.[0];

    if (weatherQuery.error || forecastQuery.error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex flex-col gap-4">
                    <p>Failed to fetch weather data. Please try again.</p>
                    <Button variant={"outline"} className="w-fit" onClick={handleRefresh}>
                        <RefreshCw className="mr-2 h-4 w-4"/>
                        Retry
                    </Button>
                </AlertDescription>
            </Alert>
        )
    }

    if (!weatherQuery.data || !forecastQuery.data) {
        return (
            <LoadingSkeleton/>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight">My Location</h1>
                <Button
                    variant={'outline'}
                    size={'icon'}
                    onClick={handleRefresh}
                    disabled={weatherQuery.isFetching || forecastQuery.isFetching}
                >
                    <RefreshCw
                        className={`w-4 h-4 ${weatherQuery.isFetching || forecastQuery.isFetching ? "animate-spin" : ""}`}/>
                </Button>
            </div>

            <div className="grid gap-6">
                <div>
                    <CurrentWeather data={weatherQuery.data} locationName={locationName}/>
                    //TODO: Hourly Temperature
                </div>
                <div>
                    //TODO: Daily Details
                    //TODO: Forecast
                </div>
            </div>
        </div>
    );
}