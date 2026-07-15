import api from './api.js';

export const studioApi = {
  // Templates
  getTemplates: (params) => api.get('/api/studio/templates', { params }),
  getTemplate: (id) => api.get(`/api/studio/templates/${id}`),
  getCategories: () => api.get('/api/studio/templates/categories'),

  // Designs
  getUserDesigns: () => api.get('/api/studio/designs'),
  getDesign: (id) => api.get(`/api/studio/designs/${id}`),
  createDesign: (data) => api.post('/api/studio/designs', data),
  updateDesign: (id, data) => api.put(`/api/studio/designs/${id}`, data),
  deleteDesign: (id) => api.delete(`/api/studio/designs/${id}`),
  duplicateDesign: (id) => api.post(`/api/studio/designs/${id}/duplicate`),

  // Assets
  getAssets: (type) => api.get('/api/studio/assets', { params: { type } }),
  createAsset: (data) => api.post('/api/studio/assets', data),
  deleteAsset: (id) => api.delete(`/api/studio/assets/${id}`),
};

export default studioApi;
