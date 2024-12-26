import React from "react";
import { Link } from "react-router-dom"; // Для маршрутизации

import "./MovieList.scss";
import MainGif from "../../assets/MainGif.gif";

const MovieList = ({ movies, filters }) => {
    // Функции для фильтрации фильмов по дате и другим параметрам
    const getStartOfWeek = (date) => {
        const start = new Date(date);
        const day = start.getDay(),
            diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        return start;
    };

    const getStartOfNextWeek = (date) => {
        const start = getStartOfWeek(date);
        start.setDate(start.getDate() + 7); // На следующей неделе
        return start;
    };

    const getEndOfNextWeek = (startOfNextWeek) => {
        const endOfNextWeek = new Date(startOfNextWeek);
        endOfNextWeek.setDate(startOfNextWeek.getDate() + 6); // Воскресенье следующей недели
        endOfNextWeek.setHours(23, 59, 59, 999);
        return endOfNextWeek;
    };

    // Фильтрация фильмов по критериям
    const filteredMovies = movies.filter((movie) => {
        const today = new Date();
        const startOfWeek = getStartOfWeek(today);
        const startOfNextWeek = getStartOfNextWeek(today);
        const endOfNextWeek = getEndOfNextWeek(startOfNextWeek);

        const matchesGenre = filters.selectedGenre
            ? movie.genre
                  .toLowerCase()
                  .includes(filters.selectedGenre.toLowerCase())
            : true;

        const matchesSearch = movie.title
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase());

        const matchesSessions = movie.sessions.some((session) => {
            const sessionDate = new Date(session.date);

            const matchesDate =
                filters.selectedDate === "На этой неделе"
                    ? sessionDate >= startOfWeek &&
                      sessionDate <= startOfNextWeek
                    : filters.selectedDate === "На следующей неделе"
                    ? sessionDate >= startOfNextWeek &&
                      sessionDate <= endOfNextWeek
                    : true;

            const matchesHallType = filters.selectedHallType
                ? session.hall_type.toLowerCase() ===
                  filters.selectedHallType.toLowerCase()
                : true;

            return matchesDate && matchesHallType;
        });

        return matchesGenre && matchesSearch && matchesSessions;
    });

    return (
        <div className="movie-list">
            {filteredMovies.length === 0 ? (
                <div className="no-movies-found">
                    <div className="message">
                        <span>Фильмы не найдены</span>
                    </div>
                    <div className="gif-container">
                        <img src={MainGif} alt="No Movies Found" />
                    </div>
                    <div className="border"></div>
                </div>
            ) : (
                filteredMovies.map((movie, index) => (
                    <Link
                        to={`/movie/${movie.title}`}
                        className="movie-card"
                        key={index}
                    >
                        {/* Изображение фильма */}
                        <div className="movie-image">
                            <img src={movie.image} alt={movie.title} />
                            <div className="age-badge">{movie.age}</div>
                        </div>

                        {/* Информация о фильме */}
                        <div className="movie-info">
                            <p className="genre">{movie.genre}</p>
                            <h3 className="title">{movie.title}</h3>

                            {/* Отображение сессий */}
                            <div className="sessions">
                                {movie.sessions && movie.sessions.length > 0 ? (
                                    <div className="session-info">
                                        <p>
                                            {new Date(
                                                movie.sessions[0].date
                                            ).toLocaleDateString()}
                                        </p>
                                        <p>{movie.sessions[0].time}</p>
                                        <p>от {movie.sessions[0].min_price}₽</p>
                                    </div>
                                ) : (
                                    <p className="no-sessions">Сессий нет</p>
                                )}
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
};

export default MovieList;
