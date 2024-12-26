import React, { useState } from "react";
import { useParams } from "react-router-dom";
import SessionModal from "../sessionModal/SessionModal";
import { movies } from "../../data/movies"; // Данные фильмов
import "./MovieDetail.scss";

const MovieDetail = ({ user, toggleModal, addBooking }) => {
    const [selectedSession, setSelectedSession] = useState(null);
    const { id } = useParams(); // Получаем id фильма из URL
    const movie = movies.find(
        (movie) => movie.id === parseInt(id) || movie.title === id
    ); // Находим фильм по id

    if (!movie) {
        return <div>Фильм не найден</div>;
    }

    return (
        <div className="movie-detail">
            <div className="movie-content">
                <div className="movie-header">
                    <img
                        src={movie.image}
                        alt={movie.title}
                        className="movie-image"
                    />
                    <div className="movie-details">
                        <h2 className="movie-title">{movie.title}</h2>
                        <p className="movie-genre">{movie.genre}</p>
                        <p className="movie-description">
                            {movie.description || "Описание не доступно."}
                        </p>

                        <div className="sessions">
                            {movie.sessions.map((session) => (
                                <button
                                    className="session-info"
                                    key={session.id}
                                    onClick={() => {
                                        if (user) {
                                            setSelectedSession(
                                                movie.sessions.filter(
                                                    (s) =>
                                                        s.hall_type ===
                                                            session.hall_type &&
                                                        s.number_or_hall ===
                                                            session.number_or_hall
                                                )
                                            );
                                        } else {
                                            toggleModal("login");
                                        }
                                    }}
                                >
                                    <p>{session.date}</p>
                                    <p>{session.time}</p>
                                    <p>от {session.min_price}₽</p>
                                    <p>
                                        Зал:
                                        {session.number_or_hall} <br />-{" "}
                                        {session.hall_type}
                                    </p>
                                </button>
                            ))}
                        </div>

                        <div className="additional-info">
                            <p>
                                <strong>Год производства:</strong> {movie.year}
                            </p>
                            <p>
                                <strong>Страна производства:</strong>{" "}
                                {movie.country}
                            </p>
                            <p>
                                <strong>Хронометраж:</strong> {movie.duration}
                            </p>
                            <p>
                                <strong>Режиссер:</strong> {movie.director}
                            </p>
                            <p>
                                <strong>Возрастное ограничение:</strong>{" "}
                                {movie.age}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="border"></div>
            </div>

            {selectedSession && (
                <SessionModal
                    sessionData={selectedSession}
                    movieTitle={movie.title}
                    onClose={() => setSelectedSession(null)}
                    addBooking={addBooking} // Передаем `addBooking`
                />
            )}
        </div>
    );
};

export default MovieDetail;
