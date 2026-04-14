import React from "react";
import { AlertTriangle, RefreshCcw, Home, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Critical System Error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = "/";
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6 font-sans">
                    <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
                        <div className="h-2 bg-rose-500 w-full" />
                        <div className="p-12 text-center space-y-8">
                            <div className="mx-auto h-24 w-24 rounded-[2.5rem] bg-rose-50 flex items-center justify-center text-rose-500 shadow-xl shadow-rose-100/50">
                                <AlertTriangle className="h-12 w-12" />
                            </div>

                            <div className="space-y-3">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hệ thống tạm gián đoạn</h1>
                                <p className="text-slate-500 font-medium leading-relaxed italic">
                                    "CodeGym IMS xin lỗi vì sự cố kỹ thuật vừa xảy ra. Đội ngũ kỹ thuật đã được thông báo."
                                </p>
                            </div>

                            <div className="grid gap-3">
                                <Button
                                    onClick={this.handleReload}
                                    className="h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
                                >
                                    <RefreshCcw className="mr-2 h-5 w-5" /> Tải lại phiên làm việc
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={this.handleGoHome}
                                    className="h-14 rounded-2xl font-bold text-slate-500 hover:bg-slate-50"
                                >
                                    <Home className="mr-2 h-5 w-5" /> Quay lại trang chủ
                                </Button>
                            </div>

                            <div className="pt-4 flex items-center justify-center gap-2">
                                <ShieldAlert className="h-4 w-4 text-slate-300" />
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">CodeGym Security Core</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
