import {Button} from "@/components/ui/button.tsx";
import {AlertCircle, MapPin, RefreshCw} from "lucide-react";
import {useGeolocation} from "@/hooks/use-geolocation.ts";
import LoadingSkeleton from "@/components/loading-skeleton.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";

export default function WeatherDashboard() {
    const {coordinates, getLocation, error: locationError, isLoading: locationLoading} = useGeolocation();

    const handleRefresh = () => {
        getLocation();

        if (coordinates) {
            // TODO: reload weather data
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

    if(!coordinates){
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

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight">My Location</h1>
                <Button
                    variant={'outline'}
                    size={'icon'}
                    onClick={handleRefresh}
                    // disabled={}
                >
                    <RefreshCw className="w-4 h-4"/>
                </Button>
            </div>
        </div>
    );
}