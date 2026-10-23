export type CourseDetailsType = {
  id: string;
  thumbnail: string;
  title: string;
  description: string;
  instructor: {
    fname: string;
    lname: string;
  };
  categories: {
    id: number;
    name: string;
  }[];

  tags: [];
  preview: {
    lessonCount: number;
    durationInMinutes: number;
  };
  videos: {
    id: number;
    title: string;
    description: string;
    bunnyVideoId: string;
    isTrailer: boolean;
    isPublic: boolean;
  }[];
};
export interface UserDetailsType {
  id: string;
  fname: string;
  lname: string;
  phone: string;
  email: string;
  isActive: boolean;
  instructorProfile: {
    id: number;
    linkedInUrl: string;
    about: string;
    description: string;
    profilePictureUrl: string;
    expertise: string;
    title: string;
    accountNo: string;
    bank: string;
    accountName: string;
  };
}
export interface DecodedTokenType {
  email: string;
  id: string;
  fname: string;
  lname: string;
  roles: string[];
  deviceSignature: string;
}
export interface DashboardDetailsType {
  activeCourses: number;
  totalViews: number;
  earnings: {
    monthlyEarning: number;
    totalEarning: number;
    pendingPayout: number;
  };
  earningsByCurrency?: Record<string, { totalEarning: number; monthlyEarning: number; paidOut: number; pendingPayout: number }>;
  oneOnOneSessions: {
    pending: number;
    completed: number;
  };
}

export interface InstructorType {
  fname: string;
  lname: string;
  profilePicture: File;
  accountNo: string;
  bank: string;
  accountName: string;
}
