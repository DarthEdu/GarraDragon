import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginTesorero = (data) => api.post('/login', data);
export const loginAportante = (data) => api.post('/aportante/login', data);
export const registerTesorero = (data) => api.post('/registro', data);
export const getPerfil = () => api.get('/perfil');
export const getAportantes = () => api.get('/aportantes');
export const getAportanteDetalle = (id) => api.get(`/aportante/${id}`);
export const createAportante = (data) => api.post('/aportante/registro', data);
export const updateAportante = (id, data) => api.put(`/aportante/actualizar/${id}`, data);
export const deleteAportante = (id, data) => api.delete(`/aportante/eliminar/${id}`, { data });
export const generarInvitacion = (data) => api.post('/invitacion/generar', data);
export const validarInvitacion = (codigo) => api.get(`/invitacion/validar/${codigo}`);
export const listarInvitaciones = () => api.get('/invitacion/listar');

export default api;