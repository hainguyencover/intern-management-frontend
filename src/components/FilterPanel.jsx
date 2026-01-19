import React from "react";
import {Input, Select, Button} from "antd";

export default function FilterPanel({
                                        filters,
                                        onFilterChange,
                                        onSearch,
                                        onReset,
                                        children
                                    }) {
    return (
        <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                {children}

                <div className="flex gap-2">
                    <Button type="primary" onClick={onSearch}>
                        Tìm kiếm
                    </Button>
                    <Button onClick={onReset}>
                        Đặt lại
                    </Button>
                </div>
            </div>
        </div>
    );
}
