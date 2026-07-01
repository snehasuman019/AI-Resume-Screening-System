import axios from 'axios';

// Create Axios client.
// Omit default 'Content-Type' header to prevent overriding browser's automatic boundary generation for FormData uploads.
const apiClient = axios.create({
  baseURL: '',
});

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Let Axios automatically detect the FormData and set the correct Content-Type (with boundary)
  const response = await apiClient.post('/resume/upload', formData);
  return response.data;
};

export const matchResume = async (jobDescription) => {
  const response = await apiClient.post('/matching/match', {
    job_description: jobDescription,
  });
  return response.data;
};

export const getCandidates = async () => {
  const response = await apiClient.get('/candidates/');
  return response.data;
};

export const getCandidateById = async (id) => {
  const response = await apiClient.get(`/candidates/${id}`);
  return response.data;
};

export const deleteCandidate = async (id) => {
  const response = await apiClient.delete(`/candidates/${id}`);
  return response.data;
};

export const getTopCandidates = async (limit) => {
  const response = await apiClient.get(`/candidates/top/${limit}`);
  return response.data;
};

export const searchCandidatesBySkill = async (skill) => {
  const response = await apiClient.get(`/candidates/search/${skill}`);
  return response.data;
};

export const getCandidateStats = async () => {
  const response = await apiClient.get('/candidates/stats');
  return response.data;
};

// Newly added endpoints for immediate interactive parsing feedback
export const getUploadedResumeSkills = async () => {
  const response = await apiClient.get('/resume/skills');
  return response.data;
};

export const getUploadedResumeParse = async () => {
  const response = await apiClient.get('/resume/parse');
  return response.data;
};

export default apiClient;
