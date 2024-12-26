import api from "./api";

export const registerUser = async (data) => {
    try {
        const response = await api.post("auth/", data);
        return response.data;
    } catch (error) {
        console.error("Ошибка при регистрации:", error);
        throw error;
    }
};

export const loginUser = async (data) => {
    try {
        const response = await api.post("auth/login/", data);
        return response.data;
    } catch (error) {
        console.error("Ошибка при входе:", error);
        throw error;
    }
};
