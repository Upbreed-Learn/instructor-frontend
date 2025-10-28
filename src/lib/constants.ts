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
