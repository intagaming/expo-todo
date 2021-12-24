import * as AuthSession from "expo-auth-session";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import supabase, { supabaseConfig } from "../../lib/supabase";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

export default function Login() {
  const handleGithubLogin = async () => {
    /**
     * Read this: https://docs.expo.dev/versions/latest/sdk/auth-session/#what--authexpoio--does-for-you
     * In the `authUrl` we don't want Supabase to know our varied URL. The auth.expo.io flow tries to hide
     *  the varied URL from Supabase. So, auth.expo.io is the one who will know our varied URL, and Supabase
     *  will only know https://auth.expo.io/@username/app-slug.
     */

    const proxyRedirectUri = AuthSession.makeRedirectUri({ useProxy: true }); // https://auth.expo.io
    const redirectUri = AuthSession.makeRedirectUri({ useProxy: false }); // Some URL which we don't know beforehand
    const provider = "github";

    const response = await AuthSession.startAsync({
      authUrl: `${supabaseConfig.url}/auth/v1/authorize?provider=${provider}&redirect_to=${proxyRedirectUri}`,
      returnUrl: redirectUri,
    });

    if (response.type !== "success") return;

    await supabase.auth.signIn({
      refreshToken: response.params.refresh_token,
    });
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <Pressable onPress={handleGithubLogin}>
        <Text>Login with GitHub</Text>
      </Pressable>
    </View>
  );
}
