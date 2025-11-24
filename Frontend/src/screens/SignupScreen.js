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

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { settings } = useContext(AccessibilityContext);
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    const result = await signup(name.trim(), email.trim(), password);
    setIsLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Account created successfully!', [{ text: 'OK' }]);
      navigation.navigate("Login");
    } else {
      Alert.alert('Error', result.error || 'Signup failed');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Ionicons name="person-add" size={64} color="#2b8a3e" />
          </View>

          <Text style={[styles.title, settings.largeText && styles.largeTitle]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, settings.largeText && styles.largeSubtitle]}>
            Join us for accessible transit navigation
          </Text>
        </View>

        <View style={styles.form}>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, settings.largeText && styles.largeLabel]}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  settings.largeText && styles.largeInput,
                  settings.highContrast && styles.highContrastInput,
                ]}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

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
                autoCapitalize="none"
                keyboardType="email-address"
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

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, settings.largeText && styles.largeLabel]}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  settings.largeText && styles.largeInput,
                  settings.highContrast && styles.highContrastInput,
                ]}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text style={styles.signupButtonText}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Text>
            {!isLoading && <Ionicons name="checkmark-circle" size={20} color="white" />}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, settings.largeText && styles.largeLoginText]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, settings.largeText && styles.largeLoginLink]}>
                Login
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

  header: { alignItems: 'center', marginTop: 20, marginBottom: 40, position: 'relative' },

  backButton: { position: 'absolute', left: 0, top: 0, padding: 8 },

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

  signupButton: {
    backgroundColor: '#2b8a3e', paddingVertical: 16, borderRadius: 12,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginTop: 8, marginBottom: 24,
  },

  signupButtonDisabled: { opacity: 0.6 },

  signupButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 8 },

  loginContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },

  loginText: { fontSize: 14, color: '#666' },
  largeLoginText: { fontSize: 16 },

  loginLink: { fontSize: 14, color: '#2b8a3e', fontWeight: 'bold' },
  largeLoginLink: { fontSize: 16 },
});
