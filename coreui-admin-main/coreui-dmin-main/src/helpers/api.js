import axios from 'axios'

const API_BASE_URL = 'http://146.190.145.42:3000'

export const api = async (method, endpoint, data = {}, extraHeaders = {}) => {
  const token = localStorage.getItem('admin_token')

  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...extraHeaders,
      },
    })

    return response.data
  } catch (err) {
    console.error('❌ API error:', err.response?.data || err.message)
    throw err
  }
}
