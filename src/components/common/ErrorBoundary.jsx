import React from "react";
import { Button, Result } from "antd";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                    <Result
                        status="500"
                        title="Đã xảy ra lỗi!"
                        subTitle="Xin lỗi, đã có sự cố xảy ra. Vui lòng thử lại sau."
                        extra={
                            <Button type="primary" onClick={this.handleReload}>
                                Tải lại trang
                            </Button>
                        }
                    />
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
