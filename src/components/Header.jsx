import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import NotificationBell from "./common/NotificationBell";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, ChevronRight, Home } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "./ui/breadcrumb";

export default function Header() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    const breadcrumbs = pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");

        return { to, label, isLast };
    });

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm print:hidden">
            <div className="flex items-center gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/dashboard" className="flex items-center gap-1">
                                    <Home className="h-3.5 w-3.5" />
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {breadcrumbs.length > 0 && <BreadcrumbSeparator />}
                        {breadcrumbs.map((bc, i) => (
                            <React.Fragment key={bc.to}>
                                <BreadcrumbItem>
                                    {bc.isLast ? (
                                        <BreadcrumbPage>{bc.label}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link to={bc.to}>{bc.label}</Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Tìm kiếm..."
                        className="w-64 pl-9 h-9 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <NotificationBell />
                    <div className="h-6 w-[1px] bg-border mx-1" />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={logout}
                        className="h-8 border-slate-200 text-slate-600 hover:text-destructive hover:border-destructive hover:bg-destructive/5 transition-colors"
                    >
                        Đăng xuất
                    </Button>
                </div>
            </div>
        </header>
    );
}
