import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import {Outlet} from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="grid min-h-screen grid-cols-[260px_1fr]">
                <Sidebar/>
                <div className="grid grid-rows-[64px_1fr]">
                    <Header/>
                    <main className="p-5">
                        <Outlet/>
                    </main>
                </div>
            </div>
        </div>
    );
}
