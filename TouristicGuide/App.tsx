import StackNavigator from './src/components/navigation/StackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  
  return (
    <AuthProvider>
      <NavigationContainer>
        <StackNavigator/>
      </NavigationContainer>
    </AuthProvider>
  );
}

