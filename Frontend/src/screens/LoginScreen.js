import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AccessibilityContext } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useContext(AccessibilityContext);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    const result = await login(email.trim(), password);
    setIsLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Login successful!', [{ text: 'OK' }]);
    } else {
      Alert.alert('Error', result.error || 'Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="train" size={64} color="#2b8a3e" />
          </View>

          <Text style={[styles.title, settings.largeText && styles.largeTitle]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, settings.largeText && styles.largeSubtitle]}>
            Sign in to continue your accessible journey
          </Text>
        </View>

        <View style={styles.form}>
          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, settings.largeText && styles.largeLabel]}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  settings.largeText && styles.largeInput,
                  settings.highContrast && styles.highContrastInput,
                ]}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, settings.largeText && styles.largeLabel]}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  settings.largeText && styles.largeInput,
                  settings.highContrast && styles.highContrastInput,
                ]}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, settings.largeText && styles.largeForgotPasswordText]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
            {!isLoading && <Ionicons name="arrow-forward" size={20} color="white" />}
          </TouchableOpacity>

          {/* Signup Link */}
          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, settings.largeText && styles.largeSignupText]}>
              Don’t have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={[styles.signupLink, settings.largeText && styles.largeSignupLink]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContent: { flexGrow: 1, padding: 24 },

  header: { alignItems: 'center', marginTop: 40, marginBottom: 40 },

  logoContainer: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: '#e8f5e9',
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },

  title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  largeTitle: { fontSize: 38 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
  largeSubtitle: { fontSize: 18 },

  form: { flex: 1 },

  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  largeLabel: { fontSize: 16 },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    backgroundColor: '#f8f9fa', paddingHorizontal: 16,
  },

  inputIcon: { marginRight: 12 },

  input: { flex: 1, fontSize: 16, color: '#333', paddingVertical: 14 },
  largeInput: { fontSize: 18, paddingVertical: 16 },
  highContrastInput: { borderWidth: 2, borderColor: '#000', backgroundColor: 'white' },

  passwordInput: { paddingRight: 12 },
  eyeIcon: { padding: 4 },

  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPasswordText: { fontSize: 14, color: '#2b8a3e', fontWeight: '500' },
  largeForgotPasswordText: { fontSize: 16 },

  loginButton: {
    backgroundColor: '#2b8a3e', paddingVertical: 16, borderRadius: 12,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 8 },

  signupContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signupText: { fontSize: 14, color: '#666' },
  largeSignupText: { fontSize: 16 },
  signupLink: { fontSize: 14, color: '#2b8a3e', fontWeight: 'bold' },
  largeSignupLink: { fontSize: 16 },
});
