import {Link} from 'react-router-dom';
import Logo from "../assets/images/logo.png"
import DarkLogo from "../assets/images/logo.png"
import {useTheme} from "@/contexts/theme-provider.tsx";
import {Moon, Sun} from "lucide-react";
import CitySearch from "@/components/CitySearch.tsx";

export default function Header() {
    const {theme, setTheme} = useTheme();
    const isDark = theme === "dark";
    return (
        <header
            className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex items-center justify-between px-4 h-16">
                <Link to={"/"}>
                    <img src={isDark ? DarkLogo : Logo} alt="Weatherly Logo" className="h-14"/>
                </Link>
                <div className="flex items-center gap-4">
                    <CitySearch/>
                    <div onClick={() => setTheme(isDark ? "light" : "dark")}
                         className={`flex items-center cursor-pointer transition-transform duration-500 ${isDark ? "rotate-180" : "rotate-0"}`}
                    >
                        {
                            isDark ? <Sun className="h-6 w-6 text-yellow-500 transition-all"/> :
                                <Moon className="h-6 w-6 text-blue-500 transition-all"/>
                        }
                    </div>
                </div>
            </div>
        </header>
    );
}