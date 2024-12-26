import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovies } from "../../services/movies";
import { getSessionById } from "../../services/sessions";
import SessionModal from "../sessionModal/SessionModal";
import "./MovieDetail.scss";

const MovieDetail = ({ user, toggleModal, addBooking }) => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const fetchedMovies = await getMovies();
                const movieDetail = fetchedMovies.find(
                    (movie) => movie.id === parseInt(id)
                ); // Ищем фильм по id
                if (movieDetail) {
                    setMovie(movieDetail);
                } else {
                    setError("Фильм не найден");
                }
            } catch (err) {
                setError("Ошибка при загрузке фильма");
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    const handleSessionClick = async (sessionId) => {
        if (user) {
            try {
                const sessionData = await getSessionById(sessionId);
                setSelectedSession(sessionData);
            } catch (error) {
                console.error("Ошибка при получении данных о сеансе:", error);
            }
        } else {
            toggleModal("login");
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!movie) {
        return <div>Фильм не найден</div>;
    }

    return (
        <div className="movie-detail">
            <div className="movie-content">
                <div className="movie-header">
                    <img
                        src={movie.image}
                        alt={movie.name}
                        className="movie-image"
                    />
                    <div className="movie-details">
                        <h2 className="movie-title">{movie.name}</h2>
                        <p className="movie-genre">
                            {movie.genres.map((genre) => genre.name).join(", ")}
                        </p>
                        <p className="movie-description">
                            {movie.annotation || "Описание не доступно."}
                        </p>

                        <div className="sessions">
                            {movie.sessions && movie.sessions.length > 0 ? (
                                movie.sessions.map((session) => (
                                    <button
                                        className="session-info"
                                        key={session.id}
                                        onClick={() =>
                                            handleSessionClick(session.id)
                                        }
                                    >
                                        <p>
                                            {new Date(
                                                session.start_time
                                            ).toLocaleDateString()}
                                        </p>
                                        <p>
                                            {session.start_time.slice(11, 16)}
                                        </p>
                                        <p>
                                            от {session.minimum_ticket_price}₽
                                        </p>
                                        <p>
                                            Зал: {session.number_or_hall} <br />
                                            {session.hall_type}
                                        </p>
                                    </button>
                                ))
                            ) : (
                                <p>Сессий нет</p>
                            )}
                        </div>

                        <div className="additional-info">
                            <p>
                                <strong>Год производства:</strong>{" "}
                                {movie.release_year}
                            </p>
                            <p>
                                <strong>Страна производства:</strong>{" "}
                                {movie.country}
                            </p>
                            <p>
                                <strong>Хронометраж:</strong> {movie.duration}{" "}
                                мин
                            </p>
                            <p>
                                <strong>Режиссер:</strong>{" "}
                                {movie.director.first_name}{" "}
                                {movie.director.last_name}
                            </p>
                            <p>
                                <strong>Возрастное ограничение:</strong>{" "}
                                {movie.age_limit}+
                            </p>
                        </div>
                    </div>
                </div>
                <div className="border"></div>
            </div>

            {selectedSession && (
                <SessionModal
                    sessionData={selectedSession} // Передаем выбранную сессию в модал
                    movieTitle={movie.name}
                    onClose={() => setSelectedSession(null)}
                    addBooking={addBooking} // Передаем `addBooking`
                />
            )}
        </div>
    );
};

export default MovieDetail;
