import { https } from '@/lib/https';

export const MUTATIONS = {
  authLogin: async function (data: {
    email: string;
    password: string;
    deviceSignature: string;
  }) {
    return await https.post(`/auth/login`, data);
  },
  requestOTP: async function (data: {
    email: string;
    otpType: 'LOGIN' | 'PASSWORD_RESET' | 'ACCOUNT_VERIFICATION';
  }) {
    return await https.post(`/auth/request-otp`, data);
  },
  verifyEmail: async function (data: {
    email: string;
    password: string;
    otp: string;
  }) {
    return await https.post(`/auth/password/reset`, data);
  },
};

export const QUERIES = {
  getUserDetails: async function (id: string) {
    return await https.get(`/instructor/${id}`);
  },
  getDashboardDetails: async function (id: string) {
    return await https.get(`/instructor/${id}/dashboard`);
  },
  getCourses: async function (id: string) {
    return await https.get(`/instructor/${id}/courses`);
  },
  getInsights: async function (id: string) {
    return await https.get(`/instructor/${id}/reviews`);
  },
};
