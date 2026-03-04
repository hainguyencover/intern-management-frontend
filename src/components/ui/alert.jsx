import * as React from "react"
import { cn } from "../../utils/utils"

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
    <div
        ref={ref}
        role="alert"
        className={cn(
            "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute left-4 top-4 [&>svg]:text-slate-950 dark:[&>svg]:text-slate-50",
            variant === "default" && "bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50",
            variant === "destructive" && "border-rose-500/50 text-rose-500 dark:border-rose-500 [&>svg]:text-rose-500",
            className
        )}
        {...props}
    />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h5
        ref={ref}
        className={cn("mb-1 font-medium leading-none tracking-tight", className)}
        {...props}
    />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm [&_p]:leading-relaxed", className)}
        {...props}
    />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
