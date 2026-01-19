export const USER_STATUS = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    LOCKED: "LOCKED",
};

export const APPLICATION_STATUS = {
    DRAFT: "DRAFT",
    SUBMITTED: "SUBMITTED",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    CONTRACT_SENT: "CONTRACT_SENT",
    CONTRACT_SIGNED: "CONTRACT_SIGNED",
};

export const DOCUMENT_STATUS = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
};

export const CONTRACT_STATUS = {
    SENT: "SENT",
    SIGNED: "SIGNED",
    CANCELLED: "CANCELLED",
};

export const PROGRAM_STATUS = {
    DRAFT: "DRAFT",
    ACTIVE: "ACTIVE",
    CLOSED: "CLOSED",
};

export const GROUP_STATUS = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
};

export const TASK_STATUS = {
    OPEN: "OPEN",
    IN_PROGRESS: "IN_PROGRESS",
    SUBMITTED: "SUBMITTED",
    APPROVED: "APPROVED",
    NEEDS_CHANGES: "NEEDS_CHANGES",
    DONE: "DONE",
};

export const DOCUMENT_TYPES = [
    { value: "CV", label: "CV" },
    { value: "APPLICATION_LETTER", label: "Đơn xin thực tập" },
    { value: "TRANSCRIPT", label: "Bảng điểm" },
    { value: "INTERNSHIP_CONTRACT", label: "Hợp đồng thực tập" },
    { value: "OTHER", label: "Khác" },
];

export const ROLES = {
    ADMIN: "ADMIN",
    HR: "HR",
    MENTOR: "MENTOR",
    INTERN: "INTERN",
};

export const PAGINATION_DEFAULT = {
    page: 0,
    size: 10,
};

export const DATE_FORMAT = "DD/MM/YYYY";
export const DATETIME_FORMAT = "DD/MM/YYYY HH:mm";
