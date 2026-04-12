import type { InstructorType } from '@/lib/constants';
import { https } from '@/lib/https';

export const MUTATIONS = {
  authLogin: async function (data: {
    email: string;
    password: string;
    deviceSignature: string;
  }) {
    return await https.post(`/auth/login?userType=INSTRUCTOR`, data);
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
  editInstructor: async function (
    id: number,
    data: Omit<InstructorType, 'id' | 'createdAt' | 'email'>,
  ) {
    return await https.patch(`/instructor/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
