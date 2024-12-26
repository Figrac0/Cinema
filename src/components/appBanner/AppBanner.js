import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Хук для навигации
import { slides } from "../../data/slides"; // Данные о слайдах/фильмах
import "./AppBanner.scss";

const AppBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [intervalId, setIntervalId] = useState(null); // Состояние для хранения ID интервала
    const navigate = useNavigate(); // Хук для навигации

    // Функция для старта таймера переключения слайдов
    const startSlideShow = () => {
        const newIntervalId = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 10000);
        setIntervalId(newIntervalId);
    };

    useEffect(() => {
        startSlideShow(); // Запускаем таймер на старте компонента

        return () => {
            if (intervalId) {
                clearInterval(intervalId); // Останавливаем таймер при размонтировании компонента
            }
        };
    }, []);

    // Функция для обработки клика по точке
    const handleDotClick = (index) => {
        setCurrentSlide(index); // Переключаем слайд
        if (intervalId) {
            clearInterval(intervalId); // Останавливаем текущий таймер
        }
        startSlideShow(); // Запускаем новый таймер
    };

    // Обработчик клика на кнопку "Забронировать"
    const handleBookClick = (id) => {
        navigate(`/movie/${id}`); // Перенаправляем на страницу фильма по ID
    };

    return (
        <div className="app-banner">
            <div
                className="banner"
                style={{
                    backgroundImage: `url(${slides[currentSlide].background})`,
                }}
            >
                <div className="banner-content">
                    <div className="title-wrapper">
                        <h1 className="title">{slides[currentSlide].title}</h1>
                        <div className="age">{slides[currentSlide].age}</div>
                    </div>
                    <p className="description">
                        {slides[currentSlide].description}
                    </p>
                    <div className="action-row">
                        <span className="price">
                            Билеты от {slides[currentSlide].price}
                        </span>
                        <button
                            className="book-btn"
                            onClick={() =>
                                handleBookClick(slides[currentSlide].id)
                            } // Передаем ID фильма
                        >
                            Забронировать
                        </button>
                    </div>
                </div>
            </div>
            <div className="dots">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${
                            index === currentSlide ? "active" : ""
                        }`}
                        onClick={() => handleDotClick(index)}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default AppBanner;
