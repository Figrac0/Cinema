import React from "react";
import { Link } from "react-router-dom";
import "./MovieList.scss";
import MainGif from "../../assets/MainGif.gif";

const MovieList = ({ movies, filters }) => {
    const getStartOfToday = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    };

    const getStartOfTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
    };

    const getEndOfTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);
        return tomorrow;
    };

    const getStartOfNextWeek = () => {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        today.setHours(0, 0, 0, 0);
        return today;
    };

    const filteredMovies = movies.filter((movie) => {
        const today = getStartOfToday();
        const tomorrowStart = getStartOfTomorrow();
        const tomorrowEnd = getEndOfTomorrow();
        const nextWeekStart = getStartOfNextWeek();

        const matchesGenre = filters.selectedGenre
            ? movie.genres[0]?.name
                  .toLowerCase()
                  .includes(filters.selectedGenre.toLowerCase())
            : true;

        const matchesSearch = movie.name
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase());

        const matchesSessions = movie.sessions.some((session) => {
            const sessionDate = new Date(session.start_time);

            const matchesDate =
                filters.selectedDate === "Сегодня"
                    ? sessionDate >= today &&
                      sessionDate <= today.setHours(23, 59, 59, 999)
                    : filters.selectedDate === "Завтра"
                    ? sessionDate >= tomorrowStart && sessionDate <= tomorrowEnd
                    : filters.selectedDate === "В ближайшее время"
                    ? sessionDate >= tomorrowStart &&
                      sessionDate <=
                          nextWeekStart.setDate(nextWeekStart.getDate() + 7)
                    : true;

            const matchesHallType = filters.selectedHallType
                ? session.hall_type.toLowerCase() ===
                  filters.selectedHallType.toLowerCase()
                : true;

            return matchesDate && matchesHallType;
        });

        return matchesGenre && matchesSearch && matchesSessions;
    });

    const getFilteredSession = (sessions) => {
        return sessions.find((session) => {
            const sessionDate = new Date(session.start_time);
            const today = getStartOfToday();
            const tomorrowStart = getStartOfTomorrow();
            const tomorrowEnd = getEndOfTomorrow();
            const nextWeekStart = getStartOfNextWeek();

            const matchesDate =
                filters.selectedDate === "Сегодня"
                    ? sessionDate >= today &&
                      sessionDate <= today.setHours(23, 59, 59, 999)
                    : filters.selectedDate === "Завтра"
                    ? sessionDate >= tomorrowStart && sessionDate <= tomorrowEnd
                    : filters.selectedDate === "В ближайшее время"
                    ? sessionDate >= tomorrowStart &&
                      sessionDate <=
                          nextWeekStart.setDate(nextWeekStart.getDate() + 7)
                    : true;

            const matchesHallType = filters.selectedHallType
                ? session.hall_type.toLowerCase() ===
                  filters.selectedHallType.toLowerCase()
                : true;

            return matchesDate && matchesHallType;
        });
    };

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
                filteredMovies.map((movie, index) => {
                    const filteredSession = getFilteredSession(movie.sessions);
                    return (
                        <Link
                            to={`/movie/${movie.id}`}
                            className="movie-card"
                            key={index}
                        >
                            {/* Изображение фильма */}
                            <div className="movie-image">
                                <img src={movie.image} alt={movie.name} />
                                <div className="age-badge">
                                    {movie.age_limit}+
                                </div>
                            </div>

                            {/* Информация о фильме */}
                            <div className="movie-info">
                                <p className="genre">{movie.genres[0]?.name}</p>
                                <h3 className="title">{movie.name}</h3>

                                {/* Отображение сессий */}
                                <div className="sessions">
                                    {filteredSession ? (
                                        <div className="session-info">
                                            <p>
                                                {new Date(
                                                    filteredSession.start_time
                                                ).toLocaleDateString()}
                                            </p>
                                            <p>
                                                {filteredSession.start_time.slice(
                                                    11,
                                                    16
                                                )}
                                            </p>
                                            <p>
                                                от{" "}
                                                {
                                                    filteredSession.minimum_ticket_price
                                                }{" "}
                                                ₽
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="no-sessions">
                                            Сессий нет
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })
            )}
        </div>
    );
};

export default MovieList;
