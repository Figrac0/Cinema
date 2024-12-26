import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { slides } from "../../data/slides";
import "./AppBanner.scss";

const AppBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const navigate = useNavigate();

    const startSlideShow = () => {
        const newIntervalId = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 10000);
        setIntervalId(newIntervalId);
    };

    useEffect(() => {
        startSlideShow();

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDotClick = (index) => {
        setCurrentSlide(index);
        if (intervalId) {
            clearInterval(intervalId);
        }
        startSlideShow();
    };

    const handleBookClick = (id) => {
        navigate(`/movie/${id}`);
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
                            }
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
