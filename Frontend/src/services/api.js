// API Configuration
// For mobile devices, use your computer's IP address instead of localhost
// Example: 'http://192.168.1.100:5000/api'
// To find your IP: On Mac/Linux run `ipconfig getifaddr en0` or `ifconfig`
// On Windows run `ipconfig` and look for IPv4 Address
const API_BASE_URL = "https://mad-project-ryls.onrender.com/api";


// API Service for Stations
export const stationAPI = {
  // Get all stations
  getAllStations: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stations`);
      if (!response.ok) {
        throw new Error('Failed to fetch stations');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching stations:', error);
      throw error;
    }
  },

  // Get station by ID
  getStationById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stations/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch station');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching station:', error);
      throw error;
    }
  },

  // Report an issue for a station
  reportIssue: async (stationId, issue, severity = 'medium', image = null) => {
    try {
      const formData = new FormData();
      formData.append('issue', issue);
      formData.append('severity', severity);
      
      if (image) {
        // React Native FormData requires specific format
        // expo-image-picker returns: { uri, width, height, mimeType, fileName }
        const imageUri = image.uri;
        const imageType = image.mimeType || 'image/jpeg';
        const imageName = image.fileName || `photo_${Date.now()}.jpg`;
        
        // For React Native, we need to append the file with proper format
        formData.append('image', {
          uri: imageUri,
          type: imageType,
          name: imageName,
        });
      }

      const response = await fetch(`${API_BASE_URL}/stations/${stationId}/report`, {
        method: 'POST',
        // Don't set Content-Type - React Native will set it automatically with boundary
        body: formData,
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to report issue';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error reporting issue:', error);
      // Provide more helpful error messages
      if (error.message.includes('Network request failed')) {
        throw new Error('Cannot connect to server. Please make sure the backend is running and check your network connection.');
      }
      throw error;
    }
  },
};

// API Service for User Profile
export const profileAPI = {
  // Get user profile
  getProfile: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (email, profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Get user's reported issues
  getMyReports: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${email}/reports`);
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  // Add reported issue to user profile
  addReportedIssue: async (email, reportData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${email}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });
      if (!response.ok) {
        throw new Error('Failed to add report');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding report:', error);
      throw error;
    }
  },
};

// Fallback to local data if API fails
export const getStationsWithFallback = async (fallbackData) => {
  try {
    const stations = await stationAPI.getAllStations();
    return stations;
  } catch (error) {
    console.warn('API failed, using fallback data:', error);
    return fallbackData;
  }
};
