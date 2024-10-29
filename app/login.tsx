import { useState } from 'react';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { HStack } from '@/components/HStack';
import { Input } from '@/components/Input';
import { Text } from '@/components/Text';
import { VStack } from '@/components/VStack';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useAuth } from '@/context/AuthContext';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { globals } from '@/styles/_global';
import { StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';





export default function Login() {
  const COGNITO_HOSTED_UI = 'https://nus-iss-team05.auth.ap-southeast-1.amazoncognito.com/oauth2/authorize?client_id=38c3gv3rqgossr577j0p7hvk2&response_type=code&scope=openid&redirect_uri=http%3A%2F%2Flocalhost%3A8081%2Flogin';
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const { isLoggedIn, authenticate, isLoadingAuth } = useAuth();
  
  async function onGoogleSignIn() {
    console.log("test");
    await Linking.openURL(COGNITO_HOSTED_UI);

     // Handle navigation state changes to detect the redirect back to your app
  // const handleNavigationStateChange = useCallback((event: WebViewNavigation) => {
  //   if (event.url.startsWith('https://staging.d2t7ocyky7f6qu.amplifyapp.com/login')) {
  //     const url = new URL(event.url);
  //     const code = url.searchParams.get('code');
  //     console.log(code);
  //   }
  //   }, [router]);

    // authenticate();
    console.log(isLoggedIn+' 1');
  }

  async function onAuthenticate() {
    getJWT(code);
    authenticate();
    console.log(isLoggedIn+' 1');
  }

  

  const url = Linking.useURL();
  const [urlState, setUrlState] = useState<string | null | undefined>(undefined);
  const [code, setCode] = useState<string>("");
  useEffect(() => {
    async function updateURL() {
      if (urlState === undefined) {
        // It seems like url is always null from the useURL (possibly because of the async nature of getInitialURL) until we explicitly call getInitialUrl.
        // So therefore, first time the URL gets a value from useURL, we call getInitialURL ourselves to get the first value.
        // See https://github.com/expo/expo/issues/23333
        const initialUrl = await Linking.getInitialURL();
        console.log("initialUrl "+initialUrl);
        setUrlState(initialUrl);
        if (initialUrl !== null) {
          const authCode = new URLSearchParams(initialUrl.split('?')[1]).get('code');
          if (authCode !== null) {
            setCode(authCode);
          }
          // Console log
          if (authCode) {
            console.log("authcode " + authCode);
            console.log("code " + code);
          }
        }
        return;
      }

      if (url === urlState) {
        return;
      }

      setUrlState(url);
    }
    console.log(urlState);

    void updateURL();
  }, [url, urlState]);

  useEffect(() => {
    // This effect runs every time `code` changes
    if (code !== null && code !== "") {
      console.log("Code changed:", code);
      onAuthenticate();
      // You can perform any additional actions here, such as:
      // - Making an API call
      // - Validating the code
      // - Triggering another state update
    }
  }, [code]);


  // get and save token
  async function getJWT(code : string) {
    console.log("fetch jwt " + `https://4467vl45j0.execute-api.ap-southeast-1.amazonaws.com/test/auth?code=${code}`);
    const response = await fetch(`https://4467vl45j0.execute-api.ap-southeast-1.amazonaws.com/test/auth?code=${code}`);
    const data = await response.json();
    console.log("DATA " + data);
    console.log( data);
  };


  // useEffect(() => {
  //   // Handler for URL redirection
  //   const handleUrlRedirect = async (event : { url: string }) => {
  //     const { url } = event;
  //     if (url && url !== currentUrl && event.url.startsWith('https://staging.d2t7ocyky7f6qu.amplifyapp.com/login')) {  // Check if the URL is new
  //       setCurrentUrl(url);             // Update the URL state
  //       const code = new URLSearchParams(url.split('?')[1]).get('code');
  //       if (code) {
  //         // authenticate(code);           // Authenticate with the code
  //         console.log(code);
  //       }
  //     }
  //   };
  
  //   // Add Linking listener
  //   const urlListener = Linking.addEventListener('url', handleUrlRedirect);
  
  //   // Check if the app was launched by a URL (cold start)
  //   Linking.getInitialURL().then((url) => {
  //     if (url) handleUrlRedirect({ url });
  //   });
  
  //   // Clean up listener on unmount
  //   return () => {
  //     urlListener.remove();
  //   };
  // }, [currentUrl]); // Dependency array includes currentUrl and authenticate



  // const [authMode, setAuthMode] = useState<"login" | "register">('login');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  // ---Check Login Boolean Value---
  // const handlePress = () => {
  //   console.log(isLoggedIn+' check');
  // };

  // function onToggleAuthMode() {
  //   setAuthMode(authMode === 'login' ? 'register' : 'login');
  // }


  return (
    <KeyboardAvoidingView behavior="padding" style={globals.container}>
      <ScrollView contentContainerStyle={globals.container}>
        <VStack flex={1} justifyContent='center' alignItems='center' p={40} gap={40}>

          <HStack gap={10}>
            <Text fontSize={30} bold mb={20}>Buffet Restaraunt Booking App</Text>
            <TabBarIcon name="restaurant" size={35} />
          </HStack >

          <VStack w={"100%"} gap={30}>

            {/* <VStack gap={ 5 }>
              <Text ml={ 10 } fontSize={ 14 } color="gray">Email</Text>
              <Input
                value={ email }
                onChangeText={ setEmail }
                placeholder="Email"
                placeholderTextColor="darkgray"
                autoCapitalize="none"
                autoCorrect={ false }
                h={ 48 }
                p={ 14 }
              />
            </VStack>

            <VStack gap={ 5 }>
              <Text ml={ 10 } fontSize={ 14 } color="gray">Password</Text>
              <Input
                value={ password }
                onChangeText={ setPassword }
                secureTextEntry
                placeholder="Password"
                placeholderTextColor="darkgray"
                autoCapitalize="none"
                autoCorrect={ false }
                h={ 48 }
                p={ 14 }
              />
            </VStack> */}
            <Button
              isLoading={isLoadingAuth}
              onPress={onGoogleSignIn}
            
              
              // onPress={handlePress}
            >
              <TabBarIcon name="logo-google" size={19} style={styles.icon} />
              Sign in with Google
            </Button>

            {/* <Button onPress={handlePress}>check login</Button> */}
            {/* <Button isLoading={ isLoadingAuth } onPress={ onAuthenticate }>{ authMode }</Button> */}

            {/* <Divider w={"90%"} />
            <VStack flex={1} justifyContent='center' alignItems='center' >
              <Text fontSize={16} underline>
                {authMode === 'login' ? 'Register new account' : 'Sign in with Google'}
              </Text>
            </VStack> */}
            
          </VStack>

        </VStack>
      </ScrollView>
    </KeyboardAvoidingView >
  );
}


const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4285F4', // Google blue color
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10, // Add space between the icon and text
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});