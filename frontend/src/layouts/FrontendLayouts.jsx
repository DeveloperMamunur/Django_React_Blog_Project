import { Outlet } from "react-router-dom";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";

export default function FrontendLayouts() {
    return (
        <div className="min-h-screen dark:bg-gray-800 dark:text-gray-200 flex flex-col">
            <Header />
            <main className="flex-grow mt-6">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}