import React from "react";
import { Modal } from "antd";

export default function ConfirmModal({ open, title, content, onConfirm, onCancel, loading }) {
    return (
        <Modal
            title={title}
            open={open}
            onOk={onConfirm}
            onCancel={onCancel}
            okText="Xác nhận"
            cancelText="Hủy"
            confirmLoading={loading}
        >
            <p>{content}</p>
        </Modal>
    );
}
