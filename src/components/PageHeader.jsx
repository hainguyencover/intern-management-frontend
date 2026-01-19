import React from "react";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";

export default function PageHeader({
                                       title,
                                       subtitle,
                                       extra,
                                       showBack = false
                                   }) {
    const navigate = useNavigate();

    return (
        <div className="mb-6 flex items-start justify-between">
            <div>
                {showBack && (
                    <Button
                        type="link"
                        onClick={() => navigate(-1)}
                        className="mb-2 px-0"
                    >
                        ← Quay lại
                    </Button>
                )}
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                {subtitle && (
                    <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
                )}
            </div>
            {extra && <div>{extra}</div>}
        </div>
    );
}
