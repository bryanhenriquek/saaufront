import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    username: string;
    role: string;
}

export const getUserFromToken = (): JwtPayload | null => {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};
