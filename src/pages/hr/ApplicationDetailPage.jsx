import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {hrGetApplicationDetail, hrReviewApplication} from "../../api/hrApplications";

export default function ApplicationDetailPage() {
    const {id} = useParams();
    const nav = useNavigate();
    const [data, setData] = useState(null);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const load = async () => {
        const res = await hrGetApplicationDetail(id);
        setData(res);
    };

    useEffect(() => {
        load();
    }, [id]);

    const canReview = data?.status === "SUBMITTED";

    const submit = async (decision) => {
        if (!window.confirm(`Confirm ${decision}?`)) return;

        setLoading(true);
        try {
            const res = await hrReviewApplication(id, {decision, comment});
            setData(res);
        } finally {
            setLoading(false);
        }
    };

    if (!data) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Application #{data.id}</h1>
                <button className="underline" onClick={() => nav(-1)}>Back</button>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                <div><b>Intern:</b> {data.internName} ({data.internEmail})</div>
                <div><b>Position:</b> {data.position || "-"}</div>
                <div><b>Applied At:</b> {data.appliedAt ? new Date(data.appliedAt).toLocaleString() : "-"}</div>
                <div><b>Status:</b> {data.status}</div>
                <div><b>Note:</b> {data.note || "-"}</div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="font-semibold">Review</div>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Optional comment..."
                    className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200"
                    disabled={!canReview}
                />
                <div className="flex gap-2">
                    <button
                        disabled={!canReview || loading}
                        onClick={() => submit("APPROVE")}
                        className="px-4 h-10 rounded-lg border disabled:opacity-50"
                    >
                        Approve
                    </button>
                    <button
                        disabled={!canReview || loading}
                        onClick={() => submit("REJECT")}
                        className="px-4 h-10 rounded-lg border disabled:opacity-50"
                    >
                        Reject
                    </button>
                </div>
                {!canReview && (
                    <div className="text-sm text-slate-500">
                        Only SUBMITTED applications can be reviewed.
                    </div>
                )}
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
                <div className="font-semibold mb-2">Review history</div>
                <div className="space-y-2">
                    {data.reviews?.length ? data.reviews.map(r => (
                        <div key={r.id} className="p-3 rounded-lg bg-slate-50">
                            <div className="text-sm">
                                <b>{r.reviewerName}</b> — {r.decision} — {r.decidedAt ? new Date(r.decidedAt).toLocaleString() : ""}
                            </div>
                            {r.comment && <div className="text-sm text-slate-600 mt-1">{r.comment}</div>}
                        </div>
                    )) : <div className="text-sm text-slate-500">No reviews yet.</div>}
                </div>
            </div>
        </div>
    );
}
