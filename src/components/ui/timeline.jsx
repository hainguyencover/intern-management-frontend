import * as React from "react"
import { cn } from "../../utils/utils"

const Timeline = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-4", className)} {...props} />
))
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("relative pl-6 pb-4 last:pb-0", className)} {...props}>
        <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
        <div className="absolute left-[5px] top-6 h-full w-px bg-border last:hidden" />
        {children}
    </div>
))
TimelineItem.displayName = "TimelineItem"

const TimelineContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
))
TimelineContent.displayName = "TimelineContent"

export { Timeline, TimelineItem, TimelineContent }
