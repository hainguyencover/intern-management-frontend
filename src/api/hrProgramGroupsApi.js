import axiosClient from "./axiosClient";

export const hrCreateGroup = (programId, payload) =>
    axiosClient.post(`/api/hr/programs/${programId}/groups`, payload).then((r) => r.data);

export const hrListGroups = (programId) =>
    axiosClient.get(`/api/hr/programs/${programId}/groups`).then((r) => r.data);

export const hrAssignMember = (groupId, internId) =>
    axiosClient.post(`/api/hr/groups/${groupId}/members`, { internId }).then((r) => r.data);

export const hrListGroupMembers = (groupId) =>
    axiosClient.get(`/api/hr/groups/${groupId}/members`).then((r) => r.data);

export const hrRemoveMember = (groupId, internId) =>
    axiosClient.delete(`/api/hr/groups/${groupId}/members/${internId}`).then((r) => r.data);
