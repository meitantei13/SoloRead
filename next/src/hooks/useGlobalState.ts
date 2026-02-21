import useSWR from "swr";

export const useUserState = () => {
  type userStateType = {
    id: number;
    name: string;
    email: string;
    isSignedIn: boolean;
    isFetched: boolean;
    yearly_reading_goal: number | null;
  };

  const fallbackData: userStateType = {
    id: 0,
    name: "",
    email: "",
    isSignedIn: false,
    isFetched: false,
    yearly_reading_goal: null,
  };

  const { data: state, mutate: setState } = useSWR("user", null, {
    fallbackData: fallbackData,
  });

  return [state, setState] as [userStateType, (value: userStateType) => void];
};

export const useSnackbarState = () => {
  type snackbarStateType = {
    message: null | string;
    severity: null | "success" | "error";
    pathname: null | string;
  };

  const fallbackData: snackbarStateType = {
    message: null,
    severity: null,
    pathname: null,
  };
  const { data: state, mutate: setState } = useSWR("snackbar", null, {
    fallbackData: fallbackData,
  });
  return [state, setState] as [
    snackbarStateType,
    (value: snackbarStateType) => void,
  ];
};
