import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './Screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import CreateLobbyScreen from './Screens/CreateLobbyScreen';
import PlayOptionsScreen from './Screens/PlayOptionsScreen';
import JoinLobbyScreen from './Screens/JoinLobbyScreen';
import LobbyScreen from './Screens/LobbyScreen';
import QuestionScreen from './Screens/QuestionScreen';
import RevealAnswersScreen from './Screens/RevealAnswersScreen';
import GameEndScreen from './Screens/GameEndScreen';

  const Stack = createNativeStackNavigator()
export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name = 'Home' component={HomeScreen} />
        <Stack.Screen name = 'PlayOptions' component={PlayOptionsScreen} />
        <Stack.Screen name = 'CreateGame' component={CreateLobbyScreen} />
        <Stack.Screen name = 'JoinGame' component={JoinLobbyScreen} />
        <Stack.Screen name = 'LobbyScreen' component={LobbyScreen} />
        <Stack.Screen name = 'QuestionScreen' component={QuestionScreen} />
        <Stack.Screen name = 'RevealAnswersScreen' component={RevealAnswersScreen} />
        <Stack.Screen name = 'GameEndScreen' component={GameEndScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}