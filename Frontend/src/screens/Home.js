import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BgImage from '../../assets/background.png';
import { useAuth } from '../context/AuthContext';   // ✅ ADDED

export default function HomePage() {
  const navigation = useNavigation();
  const { user } = useAuth();   // ✅ CHECK IF USER LOGGED IN

  // ---------- HANDLE GET STARTED ----------
  const handleGetStarted = () => {
    if (user) {
      navigation.replace("MainTabs");   // 🔥 Already logged in → go inside app
    } else {
      navigation.navigate("Signup");    // 🔥 Not logged in → go to signup
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={BgImage}
        style={{ flex: 1, justifyContent: 'space-between' }}
        imageStyle={{ opacity: 0.85 }}
      >

        {/* Top Section */}
        <View style={{ padding: 25, flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* Logo Box */}
          <View
            style={{
              width: 60,
              height: 60,
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="map" size={32} color="#2b8a3e" />
          </View>

          {/* Login Button */}
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: 'white', fontSize: 16 }}>or Log in</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Content */}
        <View style={{ paddingHorizontal: 25, paddingBottom: 50 }}>
          <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white' }}>
            Navigate accessible{'\n'}transit routes
          </Text>

          <Text style={{
            marginTop: 15,
            color: 'white',
            fontSize: 16,
            maxWidth: 280,
            opacity: 0.9
          }}>
            Use real-time data to discover and plan accessible journeys. Made by the community, for the community.
          </Text>

          {/* GET STARTED Button */}
          <TouchableOpacity
            onPress={handleGetStarted}   // ✅ UPDATED
            style={{
              marginTop: 30,
              backgroundColor: 'white',
              paddingVertical: 15,
              paddingHorizontal: 25,
              borderRadius: 50,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#222' }}>
              GET STARTED
            </Text>

            <View
              style={{
                marginLeft: 10,
                width: 45,
                height: 45,
                borderRadius: 22.5,
                backgroundColor: '#222',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Ionicons name="arrow-forward" size={24} color="white" />
            </View>
          </TouchableOpacity>

          {/* Feature Pills */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 25 }}>
            <FeaturePill text="🗺️ Accessible Routes" />
            <FeaturePill text="🔔 Real-Time Alerts" />
            <FeaturePill text="🎙️ Audio Navigation" />
          </View>

        </View>
      </ImageBackground>
    </View>
  );
}

function FeaturePill({ text }) {
  return (
    <View
      style={{
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderColor: 'rgba(255,255,255,0.3)',
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8
      }}
    >
      <Text style={{ color: 'white', fontSize: 12 }}>{text}</Text>
    </View>
  );
}
