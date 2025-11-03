import { useQuery } from '@tanstack/react-query';
import { QUERIES } from '.';

export const useGetUserDetails = (id: string) => {
  return useQuery({
    queryKey: ['userDetails'],
    queryFn: () => QUERIES.getUserDetails(id),
    enabled: !!id,
  });
};
