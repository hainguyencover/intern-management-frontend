import React from "react";
import {Table} from "antd";
import EmptyState from "./EmptyState";

export default function DataTable({
                                      columns,
                                      dataSource,
                                      loading,
                                      pagination,
                                      onChange,
                                      rowKey = "id",
                                      emptyText = "Không có dữ liệu"
                                  }) {
    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            pagination={pagination}
            onChange={onChange}
            rowKey={rowKey}
            locale={{
                emptyText: <EmptyState message={emptyText}/>
            }}
            className="rounded-lg border border-slate-200"
        />
    );
}
