import { get, post } from "../api";

// Получение всех фильмов
export const getMovies = async () => {
    try {
        const movies = await get("/movies");
        return movies;
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
};

// Отправка выбранного фильма и данных сеанса в БД
export const submitSession = async (sessionData) => {
    try {
        const response = await post("/sessions", sessionData);
        return response;
    } catch (error) {
        console.error("Error submitting session:", error);
        throw error;
    }
};
