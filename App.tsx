import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import allSettled from "promise.allsettled";
import "react-native-url-polyfill/auto";
import { QueryClient, QueryClientProvider } from "react-query";
import LogoutButton from "./src/components/LogoutButton";
import { RootStackParamList } from "./src/navigation/types";
import Loading from "./src/screens/auth/Loading";
import Login from "./src/screens/auth/Login";
import Todo from "./src/screens/Todo";
import { AuthContextProvider, useAuthUser } from "./src/state/auth-context";

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const user = useAuthUser();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user === undefined && (
          <Stack.Screen name="Loading" component={Loading} />
        )}
        {user === null && <Stack.Screen name="Login" component={Login} />}
        {user && (
          <Stack.Screen
            name="Todo"
            component={Todo}
            options={{ headerRight: LogoutButton }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const queryClient = new QueryClient();

export default function App() {
  /**
   * Polyfill for Promise.allSettled, used by Supabase. Remove when
   *  this PR has been merged: https://github.com/then/promise/pull/171
   * Supabase usage: https://github.com/supabase/supabase-js/commit/6cf54a2972472e259a775bd950c88dff4cd91a1f
   */
  allSettled.shim();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <AppNavigator />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
