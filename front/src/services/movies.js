import api from "./api";

export const getMovies = async () => {
    try {
        const response = await api.get("movies/");
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении фильмов:", error);
        throw error;
    }
};

export const getMovieById = async (id) => {
    try {
        const response = await api.get(`movies/${id}/`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении фильма по ID:", error);
        throw error;
    }
};
