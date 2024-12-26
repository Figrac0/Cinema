import React from "react";
import "./UserProfile.scss";
import emptyGif from "../../assets/empty.gif"; // Импортируем изображение

const UserProfile = ({ bookings }) => {
    return (
        <div className="user-profile">
            <h1 className="title">История бронирований:</h1>
            {bookings.length === 0 ? (
                <div className="empty-container">
                    <p className="empty">Пока что здесь пусто...</p>
                    <img
                        src={emptyGif}
                        alt="Пусто"
                        className="empty-image"
                    />{" "}
                    {/* Добавляем изображение */}
                </div>
            ) : (
                bookings.map((booking, index) => (
                    <div className="booking-card" key={index}>
                        <h2>{booking.title}</h2>
                        <p>{booking.date}</p>
                        <div className="booking-info">
                            <div className="seats">
                                Места:{" "}
                                {booking.seats.map((seat, i) => (
                                    <span key={i} className="seat">
                                        {seat.row} ряд, место {seat.number}
                                    </span>
                                ))}
                            </div>
                            <p className="price">Стоимость: {booking.price}₽</p>
                        </div>
                    </div>
                ))
            )}
            <div className="border"></div>
        </div>
    );
};

export default UserProfile;
