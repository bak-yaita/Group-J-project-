import axios from 'axios';

export const fetchUserData = async () => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users/1');
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};