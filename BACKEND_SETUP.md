# Backend Setup Instructions

## Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)
- Environment variables configured

## Setup Steps

1. **Install Dependencies**
   ```bash
   cd Backend
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the Backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

3. **Seed the Database**
   ```bash
   node src/data/seedStations.js
   ```

4. **Start the Server**
   ```bash
   npm start
   # or
   node src/server.js
   ```

5. **API Endpoints**
   - `GET /api/stations` - Get all stations
   - `GET /api/stations/:id` - Get station by ID
   - `POST /api/stations/:id/report` - Report an issue
   - `GET /api/users/:email` - Get user profile
   - `PUT /api/users/:email` - Update user profile
   - `GET /api/users/:email/reports` - Get user's reports
   - `POST /api/users/:email/reports` - Add report to user profile

## Frontend Configuration

Update the API_BASE_URL in `Frontend/src/services/api.js`:
- For iOS Simulator/Android Emulator: Use `http://localhost:5000/api`
- For physical devices: Use your computer's IP address (e.g., `http://192.168.1.100:5000/api`)

## Testing
- The backend will automatically fallback to local station data if the API is unavailable
- All API calls include error handling and fallback mechanisms


