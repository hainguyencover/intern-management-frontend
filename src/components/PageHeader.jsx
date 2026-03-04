import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function PageHeader({
    title,
    subtitle,
    extra,
    showBack = false
}) {
    const navigate = useNavigate();

    return (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                {showBack && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="mb-2 -ml-2 text-slate-500 hover:text-slate-900 px-2 h-8"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Quay lại
                    </Button>
                )}
                <h1 className="text-3xl font-black tracking-tight text-slate-900">{title}</h1>
                {subtitle && (
                    <p className="mt-1.5 text-sm font-medium text-slate-500">{subtitle}</p>
                )}
            </div>
            {extra && <div className="flex items-center gap-3">{extra}</div>}
        </div>
    );
}
