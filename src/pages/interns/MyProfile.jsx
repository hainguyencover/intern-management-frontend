import InternDocuments from "../../components/documents/InternDocuments.jsx";

export default function MyProfile() {
    const internId = 1; // TODO: lấy từ auth/me
    return (
        <div className="mx-auto w-full max-w-5xl p-4">
            <InternDocuments internId={internId}/>
        </div>
    );
}
