import {useParams, useSearchParams} from "react-router-dom";
import {useForecastQuery, useWeatherQuery} from "@/hooks/use-weather.ts";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import LoadingSkeleton from "@/components/loading-skeleton.tsx";
import CurrentWeather from "@/components/CurrentWeather.tsx";
import HourlyTemperature from "@/components/HourlyTemperature.tsx";
import WeatherDetails from "@/components/WeatherDetails.tsx";
import WeatherForecast from "@/components/WeatherForecast.tsx";

export default function City() {
    const [searchParams] = useSearchParams();
    const params = useParams();
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lon = parseFloat(searchParams.get("lon") || "0");

    const coordinates = {
        lat,
        lon,
    }

    const weatherQuery = useWeatherQuery(coordinates)
    const forecastQuery = useForecastQuery(coordinates)

    if (weatherQuery.error || forecastQuery.error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex flex-col gap-4">
                    <p>Failed to fetch weather data. Please try again.</p>
                </AlertDescription>
            </Alert>
        )
    }

    if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
        return (
            <LoadingSkeleton/>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    {params.cityName}, {weatherQuery.data.sys.country}
                </h1>
                <div>

                </div>
            </div>

            <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                    <CurrentWeather data={weatherQuery.data}/>
                    <HourlyTemperature data={forecastQuery.data}/>
                </div>
                <div className="grid gap-6 md:grid-cols-2 items-start">
                    <WeatherDetails data={weatherQuery.data}/>
                    <WeatherForecast data={forecastQuery.data}/>
                </div>
            </div>
        </div>
    );
}