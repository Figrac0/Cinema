import React, { useState, useEffect } from "react";
import "./SessionModal.scss";

const SessionModal = ({ sessionData, movieTitle, onClose, addBooking }) => {
    const [selectedTime, setSelectedTime] = useState(sessionData[0]?.time);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seats, setSeats] = useState(sessionData[0]?.seats);
    const [errorMessage, setErrorMessage] = useState("");
    const [paymentSuccess, setPaymentSuccess] = useState(false); // Новое состояние для успешной оплаты

    useEffect(() => {
        const session = sessionData.find((s) => s.time === selectedTime);
        if (session) setSeats(session.seats);
        setSelectedSeats([]);
    }, [selectedTime, sessionData]);

    const handleSeatClick = (seat) => {
        if (seat.status !== "free") return;

        // Сбрасываем сообщение об ошибке, если пользователь начинает выбирать места
        if (errorMessage) setErrorMessage("");

        setSelectedSeats((prev) => {
            if (prev.includes(seat)) {
                return prev.filter((s) => s.id !== seat.id);
            }
            return prev.length < 4 ? [...prev, seat] : prev;
        });
    };

    const handleOutsideClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            onClose();
        }
    };

    const handlePayment = () => {
        if (selectedSeats.length === 0) {
            setErrorMessage("Пожалуйста, выберите места перед оплатой.");
            return;
        }

        const bookingData = {
            title: movieTitle,
            date: sessionData[0]?.date,
            seats: selectedSeats.map((seat) => ({
                row: seat.row,
                number: seat.seat,
            })),
            price: selectedSeats.reduce((total, seat) => total + seat.price, 0),
        };

        addBooking(bookingData); // Передача данных в addBooking

        // Устанавливаем успешную оплату
        setPaymentSuccess(true);

        // Можно закрыть модальное окно, если нужно:
        // onClose();
    };

    const totalAmount = selectedSeats.reduce(
        (sum, seat) => sum + seat.price,
        0
    );

    const bluePrice = seats.find((seat) => seat.row <= 2)?.price || 0;
    const redPrice = seats.find((seat) => seat.row > 2)?.price || 0;

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="modal-overlay" onClick={handleOutsideClick}>
            <div className="session-modal" onClick={(e) => e.stopPropagation()}>
                {/* Верхняя часть */}
                <div className="modal-header">
                    <h2>
                        Мероприятие: "{movieTitle}" в зале{" "}
                        {sessionData[0]?.number_or_hall} -{" "}
                        {sessionData[0]?.hall_type}
                    </h2>
                    <p>{sessionData[0]?.date}</p>
                    <div className="time-selection">
                        {sessionData.map((session) => (
                            <button
                                key={session.time}
                                className={
                                    selectedTime === session.time
                                        ? "selected"
                                        : ""
                                }
                                onClick={() => setSelectedTime(session.time)}
                            >
                                {session.time}
                            </button>
                        ))}
                    </div>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="fborder"></div>

                {/* Центральная часть */}
                {!paymentSuccess ? (
                    <div>
                        <div className="seats-container">
                            {seats.map((seat) => (
                                <div
                                    key={seat.id}
                                    className={`seat ${seat.status} ${
                                        selectedSeats.includes(seat)
                                            ? "selected"
                                            : ""
                                    } ${seat.row <= 2 ? "blue" : "red"}`}
                                    onClick={() => handleSeatClick(seat)}
                                ></div>
                            ))}
                        </div>
                        <div className="seats-info">
                            <div className="legend blue"></div>
                            <p>{bluePrice}₽</p>
                            <div className="legend red"></div>
                            <p>{redPrice}₽</p>
                        </div>
                        <div className="fborder"></div>
                    </div>
                ) : (
                    <div className="payment-success">
                        <h3>Спасибо! Оплата прошла успешно.</h3>
                    </div>
                )}

                {/* Нижняя часть */}
                {!paymentSuccess && (
                    <div className="bottom-container">
                        {errorMessage && (
                            <div className="error-message">{errorMessage}</div>
                        )}
                        <div className="selected-seats">
                            {selectedSeats.map((seat) => (
                                <div key={seat.id} className="seat-info">
                                    <p>
                                        <strong>
                                            Ряд {seat.row}, Место {seat.seat}
                                        </strong>
                                    </p>
                                    <p>{seat.price}₽</p>
                                </div>
                            ))}
                        </div>
                        <div className="total">
                            <button onClick={handlePayment}>
                                Оплатить: {totalAmount}₽
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionModal;
