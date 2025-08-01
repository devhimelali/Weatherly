import type {WeatherData} from "@/api/types.ts";
import {Compass, Gauge, Sunrise, Sunset} from "lucide-react";
import {format} from "date-fns";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

interface WeatherDetailsProps {
    data: WeatherData
}

export default function WeatherDetails({data}: WeatherDetailsProps) {
    const {wind, main, sys} = data

    const formatTime = (time: number) => {
        return format(new Date(time * 1000), "h:mm a")
    }

    const getWindDirection = (deg: number) => {
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
        return directions[index];
    }

    const details = [
        {
            title: "Sunrise",
            value: formatTime(sys.sunrise),
            icon: Sunrise,
            color: "text-orange-500"
        },
        {
            title: "Sunset",
            value: formatTime(sys.sunset),
            icon: Sunset,
            color: "text-orange-500"
        },
        {
            title: "Wind Direction",
            value: `${getWindDirection(wind.deg)} (${wind.deg}°)`,
            icon: Compass,
            color: "text-green-500"
        },
        {
            title: "Pressure",
            value: `${main.pressure} hPa`,
            icon: Gauge,
            color: "text-purple-500"
        },

    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Weather Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                    {details.map((detail) => (
                        <div key={detail.title} className="flex items-center gap-3 rounded-lg border p-4">
                            <detail.icon className={`h-5 w-5 ${detail.color}`} />
                            <div className="flex-1">
                                <p className="text-sm font-medium leading-none">
                                    {detail.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {detail.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}