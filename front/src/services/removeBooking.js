import api from "./api";

export const removeBooking = async (bookingId) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        console.error("Нет токена");
        throw new Error("Нет токена");
    }

    try {
        const response = await api.post(
            `/bookings/${bookingId}/cancel/`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-CSRFTOKEN": localStorage.getItem("csrftoken"),
                },
            }
        );

        return response.data; // Возвращаем данные ответа от сервера (если нужно)
    } catch (error) {
        console.error("Ошибка при удалении бронирования:", error);
        throw error;
    }
};
