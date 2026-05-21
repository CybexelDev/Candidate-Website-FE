import api from "./api";

export const adminLoginApi = (data) =>
  api.post("/admin/login", data);

export const createUploadLinkApi = (data) =>
  api.post("/admin/create-upload-link", data);

export const getUploadCampaignsApi = () =>
  api.get("/admin/upload-campaigns");

export const deleteUploadCampaignApi = (id) =>
  api.delete(`/admin/upload-campaign/${id}`);

export const getCandidatesApi = () =>
  api.get("/admin/candidates");

export const getCandidateDetailsApi = (
  id
) =>
  api.get(`/admin/candidate/${id}`);

export const updateCandidateStatusApi = (
  id,
  data
) =>
  api.patch(
    `/admin/candidate-status/${id}`,
    data
  );

export const addRemarkApi = (
  id,
  data
) =>
  api.post(
    `/admin/add-remark/${id}`,
    data
  );

  export const getDashboardApi = () =>
  api.get("/admin/dashboard");

  export const adminLogoutApi = () =>
  api.post("/admin/logout");