import axiosInstance from "./api";

export const getAllLayout = async () => {
  return axiosInstance.get("/layouts");
};

export const getLayoutDetail = async (id: string) => {
  return axiosInstance.get(`/layouts/${id}`);
};

export const postLayout = async (data: any) => {
  return axiosInstance.post("/layouts", data);
};

export const putLayout = async (id: string, data: any) => {
  return axiosInstance.put(`/layouts/${id}`, data);
};

export const deleteLayout = async (id: string) => {
  return axiosInstance.delete(`/layouts/${id}`);
};
