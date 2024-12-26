import React, { useState, useEffect } from "react";
import "./SessionModal.scss";
import { createBooking } from "../../services/booking";

const SessionModal = ({ sessionData, movieTitle, onClose }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handleSeatClick = (seat) => {
        if (seat.booked) return;

        if (errorMessage) setErrorMessage("");

        setSelectedSeats((prev) => {
            const isSelected = prev.some((s) => s.id === seat.id);
            if (isSelected) {
                return prev.filter((s) => s.id !== seat.id);
            } else {
                return prev.length < 5 ? [...prev, seat] : prev;
            }
        });
    };

    const handleOutsideClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            onClose();
        }
    };

    const handlePayment = async () => {
        if (selectedSeats.length === 0) {
            setErrorMessage("Пожалуйста, выберите места перед оплатой.");
            return;
        }

        const bookingData = {
            title: movieTitle,
            date: sessionData.start_time,
            seats: selectedSeats.map((seat) => seat.id),
        };

        try {
            await createBooking(bookingData);
            setPaymentSuccess(true);
        } catch (error) {
            setErrorMessage("Ошибка при оплате.");
        }
    };

    const totalAmount = selectedSeats.reduce(
        (sum, seat) => sum + seat.price,
        0
    );

    const renderSeats = () => {
        const columns = sessionData.columns;
        const rows = sessionData.rows;

        const seatRows = [];

        for (let col = 0; col < columns; col++) {
            const columnSeats = [];

            for (let row = 0; row < rows; row++) {
                const seat = sessionData.seats.find(
                    (seat) => seat.row === row + 1 && seat.column === col + 1
                );
                columnSeats.push(seat);
            }

            seatRows.push(columnSeats);
        }

        return (
            <>
                {seatRows.map((columnSeats, colIndex) => (
                    <div key={colIndex} className="seat-column">
                        {columnSeats.map((seat) => (
                            <div
                                key={seat.id}
                                className={`seat ${
                                    seat.booked ? "booked" : "free"
                                } ${
                                    selectedSeats.some((s) => s.id === seat.id)
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => handleSeatClick(seat)}
                            >
                                {colIndex === 0 && (
                                    <span className="row-number">
                                        {seat.row} ряд
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </>
        );
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const formattedDate = new Date(sessionData.start_time).toLocaleDateString();
    const formattedTime = new Date(sessionData.start_time).toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
    );

    const isBigHall = sessionData.rows > 4;

    return (
        <div className="modal-overlay" onClick={handleOutsideClick}>
            <div className="session-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        Мероприятие: "{movieTitle}" в зале{" "}
                        {sessionData.hall_number} - {sessionData.hall_type}
                    </h2>
                    <p>{formattedDate}</p>
                    <div className="time-selection">
                        <button className="selected">{formattedTime}</button>
                    </div>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="fborder"></div>

                {!paymentSuccess ? (
                    <div>
                        <div className="cinema-hall">
                            <div className="screen">Экран</div>
                            <div
                                className={`seats-container  ${
                                    isBigHall ? "big-hall" : "six-columns"
                                }`}
                            >
                                {renderSeats()}
                            </div>
                        </div>
                        {errorMessage && (
                            <div className="error-message">{errorMessage}</div>
                        )}
                    </div>
                ) : (
                    <div className="payment-success">
                        <h3>Оплата успешна!</h3>
                        <p>Ваши билеты на фильм "{movieTitle}" куплены.</p>
                    </div>
                )}

                <div className="fborder"></div>

                {!paymentSuccess && (
                    <div className="modal-footer">
                        <div className="selected-seats">
                            {selectedSeats.map((seat) => (
                                <div key={seat.id} className="seat-info">
                                    <p>
                                        ряд {seat.row},<br /> место{" "}
                                        {seat.column}
                                    </p>
                                    <p>Цена: {seat.price}₽</p>
                                </div>
                            ))}
                        </div>
                        <div className="total">
                            <button
                                className="pay-button"
                                onClick={handlePayment}
                                disabled={selectedSeats.length === 0}
                            >
                                Оплатить {totalAmount}₽
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionModal;
