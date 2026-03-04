import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "./ui/table";
import { Skeleton } from "./ui/skeleton";
import EmptyState from "./EmptyState";

export default function DataTable({
    columns,
    dataSource = [],
    loading,
    pagination,
    onChange,
    rowKey = "id",
    emptyText = "Không có dữ liệu"
}) {
    const renderCell = (record, column, index) => {
        if (column.render) {
            return column.render(record[column.dataIndex], record, index);
        }
        return record[column.dataIndex];
    };

    const getRowKey = (record, index) => {
        if (typeof rowKey === "function") return rowKey(record, index);
        return record[rowKey] || index;
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow>
                        {columns.map((col) => (
                            <TableHead key={col.key || col.dataIndex} className="font-bold text-slate-700">
                                {col.title}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={`skeleton-${i}`}>
                                {columns.map((_, j) => (
                                    <TableCell key={`cell-skeleton-${j}`}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : dataSource.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-32 text-center">
                                <EmptyState message={emptyText} />
                            </TableCell>
                        </TableRow>
                    ) : (
                        dataSource.map((record, index) => (
                            <TableRow key={getRowKey(record, index)} className="hover:bg-slate-50/50 transition-colors">
                                {columns.map((col) => (
                                    <TableCell key={col.key || col.dataIndex} className="py-3 px-4">
                                        {renderCell(record, col, index)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
