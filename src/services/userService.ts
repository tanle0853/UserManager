import { user } from "@/interfaces/user";
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

interface LoginData {
  username: string;
  password: string;
}


const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
});

const getUserToken = (): string | null => {
  return localStorage.getItem('userToken');
};

// Hàm kiểm tra xem người dùng có quyền admin hay không
const isAdmin = (): boolean => {
  // Thực hiện kiểm tra quyền ở đây, ví dụ có thể lấy thông tin user từ localStorage
  // và kiểm tra trường role
  // Trong ví dụ này, giả định là role được lưu trong token và có giá trị 'admin'
  const token = getUserToken();
  if (token) {
    const decodedToken = decodeToken(token); // Hàm decode token (tùy thuộc vào cách bạn xử lý token)
    return decodedToken?.role === 'admin';
  }
  return false;
};

// Các hàm API với token đã được thêm tự động
export const getusers = async (): Promise<AxiosResponse<user[]>> =>
  axiosInstance.get('/user');

export const getuser = async (id: string): Promise<AxiosResponse<user>> =>
  axiosInstance.get(`/user/${id}`);

export const createuser = async (user: any): Promise<AxiosResponse> => {
  const token = getUserToken();

  if (token && isAdmin()) {
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
  newuser: any
): Promise<AxiosResponse<user>> => {
  const token = getUserToken();

  if (token && isAdmin()) {
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

  if (token && isAdmin()) {
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
// Hàm decode token, có thể thực hiện bằng thư viện như jsonwebtoken (nếu sử dụng Node.js)
const decodeToken = (token: string): any => {
  // Thực hiện decode token ở đây
  // Trong trường hợp giả định, đây chỉ là ví dụ đơn giản
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
};

// Hàm loginUser không còn được thêm token tự động do nó là hàm đăng nhập
export const loginUser = async (loginData: LoginData): Promise<AxiosResponse> => {
  return axiosInstance.post('/login', loginData);
};
