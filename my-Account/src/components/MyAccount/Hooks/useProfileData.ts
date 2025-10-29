import { ProfileDataBackendResponse } from "../FormContext";
import { getProfileInfo } from "../../services/Account.service";
import { useQuery } from "@tanstack/react-query";

export function useProfileData() {
  return useQuery({
    queryKey: ["profileInfo"],
    queryFn: getProfileInfo,
    select: (data: ProfileDataBackendResponse) => data?.data[0],
  });
}
