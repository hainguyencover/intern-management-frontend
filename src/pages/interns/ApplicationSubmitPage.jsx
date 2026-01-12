import {useState} from "react";
import axios from "../../api/axiosClient";

export default function ApplicationSubmitPage() {
    const [position, setPosition] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const submit = async () => {
        setLoading(true);
        try {
            await axios.post("/api/applications", {position, note});
            setSuccess(true);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-semibold">Đã nộp hồ sơ thành công</h2>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4 max-w-xl">
            <h1 className="text-xl font-semibold">Nộp hồ sơ thực tập</h1>

            <input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Vị trí ứng tuyển"
                className="w-full h-10 px-3 border rounded-lg"
            />

            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú"
                className="w-full min-h-[120px] p-3 border rounded-lg"
            />

            <button
                onClick={submit}
                disabled={loading}
                className="px-4 h-10 rounded-lg border"
            >
                Gửi hồ sơ
            </button>
        </div>
    );
}
