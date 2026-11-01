import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true // MANDATORY: This passes your login session cookies to the backend
});

export default API;