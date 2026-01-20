import React, { useEffect, useState } from "react";
import { Card, Calendar, Badge, Empty } from "antd";
import { scheduleApi } from "../../api/scheduleApi";
import { toast } from "sonner";

export default function MySchedule() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSchedule();
    }, []);

    const loadSchedule = async () => {
        setLoading(true);
        try {
            const res = await scheduleApi.getMySchedule();
            setEvents(res.data || []);
        } catch (error) {
            toast.error("Không thể tải lịch");
        } finally {
            setLoading(false);
        }
    };

    const dateCellRender = (value) => {
        const dateStr = value.format("YYYY-MM-DD");
        const dayEvents = events.filter((e) => e.date === dateStr);

        return (
            <ul className="events">
                {dayEvents.map((item) => (
                    <li key={item.id}>
                        <Badge status="success" text={item.title} />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="mx-auto max-w-6xl">
            <Card title="Lịch thực tập của tôi" loading={loading}>
                {events.length === 0 && !loading ? (
                    <Empty description="Chưa có lịch" />
                ) : (
                    <Calendar cellRender={dateCellRender} />
                )}
            </Card>
        </div>
    );
}
