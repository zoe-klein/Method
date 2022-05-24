import axios, { AxiosError } from "axios";
import React, { createContext, useContext } from "react";
import { useAsyncRetry } from "react-use";
import { Dimmer, Loader } from "semantic-ui-react";
import { ApiResponse } from "../constants/types";
import { useSubscription } from "../hooks/use-subscription";
import { useProduce } from "../hooks/use-produce";
import { Error } from "../constants/types";
import { LoginPage } from "../pages/login-page/login-page";
import { User } from "../constants/types";
import { StatusCodes } from "../constants/status-codes";

const currentUser = "currentUser";
const baseUrl = process.env.REACT_APP_API_BASE_URL;

//functions for setting session storage
const setUserItem = (user: UserDto) => {
  sessionStorage.setItem(currentUser, JSON.stringify(mapUser(user)));
};

const removeUserItem = () => {
  sessionStorage.removeItem(currentUser);
};

type AuthState = {
  user: User | null;
  errors: Error[];
  redirectUrl?: string | null;
};

const INITIAL_STATE: AuthState = {
  user: null,
  errors: [],
  redirectUrl: null,
};

export const AuthContext = createContext<AuthState>(INITIAL_STATE);

export const AuthProvider = (props: any) => {
  const [state, setState] = useProduce<AuthState>(INITIAL_STATE);

  //This is the main function for getting the user information from the database.
  //This function gets called on every "notify("user-login") in order to fetfch the user data."
  const fetchCurrentUser = useAsyncRetry(async () => {
    setState((draft) => {
      draft.errors = [];
    });

    axios
      .get<GetUserResponse>(`${baseUrl}/api/get-current-user`)
      //.then is what happens once the response comes back successful from the API.
      .then((response) => {
        if (response.data.hasErrors) {
          response.data.errors.forEach((err) => {
            console.error(err.message);
          });
        }

        //Updating the state of the context to have the user data as well as any errors.
        setState((draft) => {
          draft.user = response.data.data;
          draft.errors = response.data.errors;
        });

        //Setting the session storage item of the user.
        setUserItem(response.data.data);
      })
      //.catch will catch any errors from the call.
      .catch(({ response, ...rest }: AxiosError<GetUserResponse>) => {
        if (response?.data.hasErrors) {
          response?.data.errors.forEach((err) => {
            console.log(err.message);
          });
        } else {
          console.error(rest.toJSON());
        }
      });
  }, [setState]);

  //Same deal as login.  This function is used to call the logout endpoint
  const logoutUser = () => {
    setState((draft) => {
      draft.errors = [];
    });

    //Setting up axios call
    axios
      .post(`${baseUrl}/api/logout`)
      .then((res) => {
        if (res.status !== StatusCodes.OK) {
          console.log(`Error on logout: ${res.statusText}`);
        } else {
          removeUserItem();
          setState((draft) => {
            draft.user = null;
          });
          console.log("Successfully Logged Out!");
        }
      })
      .catch(({ response, ...rest }: AxiosError<any>) => {
        if (response?.data.hasErrors) {
          response?.data.errors.forEach((err) => {
            console.log(err.message);
          });
        } else {
          console.error(rest.toJSON());
        }
      });
  };

  //This listens for any "notify("user-login") and performs the action specified."
  useSubscription("user-login", () => {
    fetchCurrentUser.retry();
  });

  //This listens for any "notify("user-logout") and performs the action specified."
  useSubscription("user-logout", () => {
    logoutUser();
  });

  //This returns a Loading screen if the API call takes a long time to get user info
  if (fetchCurrentUser.loading) {
    return (
      <Dimmer active inverted>
        <Loader indeterminate />
      </Dimmer>
    );
  }

  //Brings unauthenticated users to the login page.
  //This can be made to bring them to a different part of the app eventually
  if (!state.user && !fetchCurrentUser.loading) {
    return <LoginPage />;
  }

  //Once they are logged in and not loading, it brings them to the app.
  return <AuthContext.Provider value={state} {...props} />;
};

type UserDto = User & {
  userName: string;
  password: string;
};

type GetUserResponse = ApiResponse<UserDto>;

//This function is available anywhere wrapped inside of the <AuthProvider>.  See Config.tsx for example.
export function useUser(): User {
  const { user } = useContext(AuthContext);
  if (!user) {
    throw new Error(`useUser must be used within an authenticated app`);
  }
  return user;
}

//This is used to map an object (any type) to a User entity.
export const mapUser = (user: any): Omit<User, "userName"> => ({
  firstName: user.firstName,
  lastName: user.lastName,
});
