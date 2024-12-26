import { post, get } from "../api";

// Получение данных пользователя
export const getUserProfile = async (userId) => {
    try {
        const userProfile = await get(`/users/${userId}`);
        return userProfile;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

// Обновление данных пользователя
export const updateUserProfile = async (userId, profileData) => {
    try {
        const response = await post(`/users/${userId}`, profileData);
        return response;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};
