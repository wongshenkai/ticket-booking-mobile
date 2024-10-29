import { userService } from '@/services/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { User } from '@/types/user';
import { Redirect } from 'expo-router';

interface AuthContextProps {
  isLoggedIn: boolean;
  isLoadingAuth: boolean;
  authenticate: VoidFunction;
  // authenticate: (authCode: string) => void; 
  logout: VoidFunction;
  user: User | null;
  // authCode: string;
  // getJWT: (code: string) => Promise<void>;
}

const AuthContext = React.createContext({} as AuthContextProps);

export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthenticationProvider({ children }: React.PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authCode, setAuthCode] = useState<string>("");

  useEffect(() => {
    async function checkIfLoggedIn() {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');

      if (token && user) {
        setIsLoggedIn(true);
        setUser(JSON.parse(user));
        router.replace('(authed)');
      } else {
        setIsLoggedIn(false);
        // ---Check Login Boolean Value---
        console.log(isLoggedIn+" 2")
      }
    }

    checkIfLoggedIn();
    // ---Check Login Boolean Value---
    console.log(isLoggedIn+' 3');
  }, []);


  function authenticate() {
    // function authenticate(authCode: string) {
    // try {
    //   setIsLoadingAuth(true);

    //   const response = await userService[authMode](email, password);

    //   if (response) {
    //     setIsLoggedIn(true);
        // await AsyncStorage.setItem('token', response.data.token);
    //     await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    //     setUser(response.data.user);
    //     router.replace('(authed)');
    //   }
    // } catch (error) {
    //   setIsLoggedIn(false);
    // } finally {
    //   setIsLoadingAuth(false);
    // }
    // console.log(isLoadingAuth+' 01');
    setIsLoadingAuth(true);
    // getJWT(authCode);
    // console.log(isLoadingAuth+' 02');
    setIsLoggedIn(true);
    router.replace('(authed)');
    setIsLoadingAuth(false);
    // ---Check Login Boolean Value---
    // console.log(isLoggedIn+' 1');
    // should be false since state updates in React are asynchronous, 
    // which means the new state value (true in this case) is not immediately available in the same function call where you trigger the state update.

  }

  function logout() {
    setIsLoggedIn(false);
    // ---Check Login Boolean Value---
    // console.log(isLoggedIn+' 4');
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider
      value={ {
        authenticate,
        logout,
        isLoggedIn,
        isLoadingAuth,
        user,
      } }>
      { children }
    </AuthContext.Provider>
  );
}
