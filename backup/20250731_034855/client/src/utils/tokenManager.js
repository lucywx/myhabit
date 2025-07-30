// Token管理工具
class TokenManager {
    static getToken() {
        return localStorage.getItem('token');
    }

    static setToken(token) {
        localStorage.setItem('token', token);
    }

    static removeToken() {
        localStorage.removeItem('token');
    }

    static isTokenExpired(token) {
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            return true;
        }
    }

    static async refreshToken() {
        try {
            const currentToken = this.getToken();
            if (!currentToken) return false;

            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.setToken(data.token);
                return true;
            }
        } catch (error) {
            console.error('Token刷新失败:', error);
        }
        return false;
    }

    static async getValidToken() {
        const token = this.getToken();

        if (!token || this.isTokenExpired(token)) {
            const refreshed = await this.refreshToken();
            if (!refreshed) {
                this.removeToken();
                window.location.href = '/';
                return null;
            }
            return this.getToken();
        }

        return token;
    }
}

export default TokenManager; 