import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./components/Layout";
import {ThemeProvider} from "@/contexts/theme-provider.tsx";
import WeatherDashboard from "@/pages/WeatherDashboard.tsx";
import City from "@/pages/City.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

function App() {
    const queryClient = new QueryClient()
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <ThemeProvider defaultTheme={"dark"}>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<WeatherDashboard/>}/>
                                <Route path="/cities/:cityName" element={<City/>}/>
                            </Routes>
                        </Layout>
                    </ThemeProvider>
                </BrowserRouter>
                <ReactQueryDevtools initialIsOpen={false}/>
            </QueryClientProvider>
        </>
    )
}

export default App
