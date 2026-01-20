import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function FileUpload({
                                       onUpload,
                                       accept = "*",
                                       maxSize = 5, // MB
                                       multiple = false,
                                       listType = "text"
                                   }) {
    const [fileList, setFileList] = useState([]);

    const beforeUpload = (file) => {
        const isLt = file.size / 1024 / 1024 < maxSize;
        if (!isLt) {
            message.error(`Kích thước file không được vượt quá ${maxSize}MB`);
            return Upload.LIST_IGNORE;
        }
        return false; // Prevent auto upload
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (onUpload) {
            const files = newFileList.map(f => f.originFileObj).filter(Boolean);
            onUpload(files);
        }
    };

    return (
        <Upload
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            multiple={multiple}
            accept={accept}
            listType={listType}
        >
            <Button icon={<UploadOutlined />}>
                Chọn file
            </Button>
        </Upload>
    );
}
