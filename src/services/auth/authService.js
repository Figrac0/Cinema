import { post } from "../api";

// Регистрация пользователя
export const registerUser = async (userData) => {
    try {
        const response = await post("/register", userData);
        return response;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

// Вход пользователя
export const loginUser = async (userData) => {
    try {
        const response = await post("/login", userData);
        return response;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};
