import API_BASE_URL from "@/config";
import { post } from "@/services/network.service";

class AuthService {
  async login(user) {
    try {
      const response = await fetch(API_BASE_URL + 'auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, password: user.password }),
      });
      if (response.ok) {
        return {
          token : response.headers.get('x-access-token'),
          body  : await response.json()
        };
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      throw new Error("Login failed");
    }
  }

  async changePassword(auth) {
    try {
      return await post('auth/changePassword', auth);
    } catch (error) {
      throw new Error("Change Password failed");
    }
  }

  logout() {    
  }

  async register(user) {
    try {
      return await post('auth/signup', {
        username: user.username,
        email: user.email,
        password: user.password
      });
    } catch (error) {
      throw new Error("Registration failed");
    }
  }
}

export default new AuthService();