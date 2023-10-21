import { user } from "@/interfaces/user";
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

interface LoginData {
  username: string;
  password: string;
}


const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
});

// Hàm loginUser không còn được thêm token tự động do nó là hàm đăng nhập
export const loginUser = async (loginData: LoginData): Promise<AxiosResponse> => {
  return axiosInstance.post('/login', loginData);
};

export const searchUsers = async (username: string): Promise<AxiosResponse<user[]>> => {
  return axiosInstance.get(`/user/search/${username}`);
};

export const logoutUser = async () => {
  try {
    await axiosInstance.post('/logout');
    // Sau khi đăng xuất thành công, bạn có thể thực hiện các thay đổi khác, như xóa thông tin đăng nhập khỏi localStorage hoặc chuyển hướng người dùng đến trang đăng nhập.
  } catch (error) {
    console.error('Logout failed:', error);
    // Xử lý lỗi (nếu có) ở đây
  }
};

const getUserToken = (): string | null => {
  return localStorage.getItem('userToken');
};


// Các hàm API với token đã được thêm tự động
// export const getusers = async (): Promise<AxiosResponse<user[]>> =>
//   axiosInstance.get('/user');
export const getusers = async (): Promise<AxiosResponse<user[]>> => {
  const token = getUserToken();

  if (token) {
    try {
      const response = await axiosInstance.get('/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response as AxiosResponse<user[]>;
      } else {
        throw new Error('Invalid response data format');
      }
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  } else {
    throw new Error('Unauthorized');
  }
};


// export const getuser = async (id: string): Promise<AxiosResponse<user>> =>
//   axiosInstance.get(`/user/${id}`);
export const getuser = async (id: string): Promise<AxiosResponse<user>> => {
  const token = getUserToken();

  if (token) {
    try {
      const response = await axiosInstance.get(`/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data && typeof response.data === 'object') {
        return response as AxiosResponse<user>;
      } else {
        throw new Error('Invalid response data format');
      }
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  } else {
    throw new Error('Unauthorized');
  }
};

export const createuser = async (user: user): Promise<AxiosResponse> => {
  const token = getUserToken();
  if (token) {
    const response = await axiosInstance.post('/user', user, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Kiểm tra kiểu dữ liệu của response.data
    if (response.data && typeof response.data === 'object') {
      return response as AxiosResponse<user>; // Ép kiểu dữ liệu
    } else {
      throw new Error('Invalid response data format');
    }
  } else {
    // Xử lý trường hợp không có token hoặc không có quyền admin
    throw new Error('Unauthorized');
  }
};

export const updateuser = async (
  id: string,
  newuser: user
): Promise<AxiosResponse<user>> => {
  const token = getUserToken();

  if (token) {
    const response = await axiosInstance.put(`/user/${id}`, newuser, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Kiểm tra kiểu dữ liệu của response.data
    if (response.data && typeof response.data === 'object') {
      return response as AxiosResponse<user>; // Ép kiểu dữ liệu
    } else {
      throw new Error('Invalid response data format');
    }
  } else {
    // Xử lý trường hợp không có token hoặc không có quyền admin
    throw new Error('Unauthorized');
  }
};

export const deleteuser = async (id: string): Promise<AxiosResponse> => {
  const token = getUserToken();

  if (token) {
    const response = await axiosInstance.delete(`/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Kiểm tra kiểu dữ liệu của response.data
    if (response.data && typeof response.data === 'object') {
      return response as AxiosResponse<user>; // Ép kiểu dữ liệu
    } else {
      throw new Error('Invalid response data format');
    }
  } else {
    // Xử lý trường hợp không có token hoặc không có quyền admin
    throw new Error('Unauthorized');
  }
};
