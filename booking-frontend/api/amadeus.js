// utils/amadeusApi.js
import axios from 'axios';

const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';

const API_BASE = 'https://test.api.amadeus.com';

export const getAccessToken = async () => {
  const res = await axios.post(`${API_BASE}/v1/security/oauth2/token`,
    `grant_type=client_credentials&client_id=${'3GCBrdA8qmYofVjLXOqVrnzY4z0ymXXQ'}&client_secret=${'13dXbs983fQtARY1'}`,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return res.data.access_token;
};

export const fetchFlightsFromAmadeus = async (params) => {
  const token = await getAccessToken();

  const response = await axios.get(`${API_BASE}/v2/shopping/flight-offers`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  });

  return response.data.data;
};
