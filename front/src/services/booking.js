import api from "./api";

export const createBooking = async (bookingData) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        console.error("Нет токена");
        return;
    }

    const dataToSend = {
        seats: bookingData.seats,
    };

    try {
        const response = await api.post("bookings/", dataToSend, {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-CSRFTOKEN": localStorage.getItem("csrftoken"),
            },
        });

        return response.data;
    } catch (error) {
        console.error("Ошибка при создании бронирования:", error);
        throw error;
    }
};
