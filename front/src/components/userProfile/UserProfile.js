import React, { useState, useEffect } from "react";
import emptyGif from "../../assets/empty.gif"; // Импортируем изображение
import "./UserProfile.scss";
import { removeBooking } from "../../services/removeBooking"; // Импортируем функцию удаления бронирования

const UserProfile = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Состояние для загрузки данных
    const [error, setError] = useState(null); // Состояние для ошибок

    useEffect(() => {
        const fetchBookings = async () => {
            setIsLoading(true); // Устанавливаем состояние загрузки в true
            const token = localStorage.getItem("access_token");
            if (!token) {
                console.error("Нет токена");
                setError("Нет токена");
                setIsLoading(false);
                return;
            }
            try {
                const response = await fetch(
                    "http://127.0.0.1/api/v1/bookings/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                setBookings(data); // Записываем данные о бронированиях
                setIsLoading(false); // Устанавливаем состояние загрузки в false
            } catch (error) {
                console.error("Ошибка при получении бронирований:", error);
                setError("Ошибка при получении бронирований");
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleRemoveBooking = async (bookingId) => {
        try {
            await removeBooking(bookingId);

            setBookings((prevBookings) =>
                prevBookings.filter((booking) => booking.id !== bookingId)
            );
        } catch (error) {
            console.error("Ошибка при удалении бронирования:", error);
            setError("Ошибка при удалении бронирования");
        }
    };

    if (isLoading) {
        return <p>Загрузка...</p>; // Показываем сообщение, пока данные загружаются
    }

    return (
        <div className="user-profile">
            <h1 className="title">История бронирований:</h1>
            {error && <p className="error-message">{error}</p>}{" "}
            {/* Показываем ошибку, если она есть */}
            {bookings.length === 0 ? (
                <div className="empty-container">
                    <p className="empty">Пока что здесь пусто...</p>
                    <img src={emptyGif} alt="Пусто" className="empty-image" />
                </div>
            ) : (
                bookings.map((booking) => {
                    // Преобразуем строку времени в объект Date
                    const sessionDate = new Date(booking.start_time);
                    const currentTime = new Date();

                    // Проверяем, прошел ли сеанс
                    const isSessionPassed = sessionDate <= currentTime;

                    return (
                        <div className="booking-card" key={booking.id}>
                            <h2>{booking.movie_name}</h2>
                            <p>
                                {new Date(
                                    booking.booked_at
                                ).toLocaleDateString()}
                            </p>
                            <div className="booking-info">
                                {/* Проверка на отменённое бронирование */}
                                {booking.status === "cancelled" ? (
                                    <p className="cancelled-message">
                                        Этот сеанс отменён
                                    </p>
                                ) : (
                                    <div className="seats">
                                        Места:{" "}
                                        {booking.seats.map((seat, i) => (
                                            <span key={i} className="seat">
                                                {seat.row} ряд, место{" "}
                                                {seat.column}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {/* Отображаем цену только если бронирование не отменено */}
                                {booking.status !== "cancelled" && (
                                    <p className="price">
                                        Стоимость: {booking.price}₽
                                    </p>
                                )}
                            </div>
                            {/* Скрываем кнопку "Отменить", если сеанс уже прошел или отменен */}
                            {booking.status !== "cancelled" &&
                                !isSessionPassed && (
                                    <button
                                        className="remove-button"
                                        onClick={() =>
                                            handleRemoveBooking(booking.id)
                                        }
                                    >
                                        Отменить
                                    </button>
                                )}
                        </div>
                    );
                })
            )}
            <div className="border"></div>
        </div>
    );
};

export default UserProfile;
