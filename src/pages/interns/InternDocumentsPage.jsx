import React, { useEffect, useState } from "react";
import { documentApi } from "../../api/documentApi";
import DocumentUploader from "../../components/DocumentUploader";
import DocumentList from "../../components/DocumentList";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { FileStack, UploadCloud, List } from "lucide-react";

export default function InternDocumentsPage() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        setLoading(true);
        try {
            const res = await documentApi.getMyDocuments();
            setDocuments(res.data);
        } catch (error) {
            toast.error("Không thể tải danh sách tài liệu");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await documentApi.deleteDocument(id);
            toast.success("Xóa thành công");
            loadDocuments();
        } catch (error) {
            toast.error("Xóa thất bại");
        }
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6 pb-12">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                    <FileStack className="h-8 w-8 text-primary" />
                    Quản lý tài liệu
                </h1>
                <p className="text-slate-500 font-medium">Lưu trữ và quản lý hồ sơ, CV, và các tài liệu liên quan đến thực tập.</p>
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50">
                <CardHeader className="pb-0">
                    <Tabs defaultValue="list" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                            <TabsTrigger value="list" className="flex items-center gap-2">
                                <List className="h-4 w-4" /> Danh sách
                            </TabsTrigger>
                            <TabsTrigger value="upload" className="flex items-center gap-2">
                                <UploadCloud className="h-4 w-4" /> Tải lên mới
                            </TabsTrigger>
                        </TabsList>

                        <div className="mt-6">
                            <TabsContent value="upload" className="animate-in fade-in-50 duration-300">
                                <CardHeader className="px-0 pt-0">
                                    <CardTitle>Cổng tải lên tài liệu</CardTitle>
                                    <CardDescription>Chọn loại tài liệu và tải lên hệ thống. Tối đa 5MB mỗi file.</CardDescription>
                                </CardHeader>
                                <CardContent className="px-0 pb-6">
                                    <DocumentUploader type="CV" onUploadSuccess={loadDocuments} />
                                </CardContent>
                            </TabsContent>

                            <TabsContent value="list" className="animate-in fade-in-50 duration-300">
                                <CardHeader className="px-0 pt-0">
                                    <CardTitle>Kho tài liệu của tôi</CardTitle>
                                    <CardDescription>Danh sách các tệp tin bạn đã tải lên và trạng thái phê duyệt.</CardDescription>
                                </CardHeader>
                                <CardContent className="px-0 pb-6">
                                    <DocumentList
                                        documents={documents}
                                        onDelete={handleDelete}
                                        loading={loading}
                                    />
                                </CardContent>
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardHeader>
            </Card>
        </div>
    );
}
