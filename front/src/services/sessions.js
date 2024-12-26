import api from "./api";

export const getSessionById = async (sessionId) => {
    try {
        const response = await api.get(`sessions/${sessionId}/`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении сеанса:", error);
        throw error;
    }
};
