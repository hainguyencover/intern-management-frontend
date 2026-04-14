import React from "react";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";

export default function FilterPanel({
    filters,
    onFilterChange,
    onSearch,
    onReset,
    children
}) {
    return (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 items-end">
                {children}

                <div className="flex gap-2">
                    <Button
                        onClick={onSearch}
                        className="flex-1 shadow-lg shadow-primary/20"
                    >
                        <Search className="mr-2 h-4 w-4" />
                        Tìm kiếm
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onReset}
                        className="flex-1"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Đặt lại
                    </Button>
                </div>
            </div>
        </div>
    );
}
