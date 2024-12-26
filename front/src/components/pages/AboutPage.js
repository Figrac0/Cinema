import React from "react";
import { Link } from "react-router-dom"; // Импортируем Link для роутинга
import "./AboutPage.scss";

const AboutPage = () => {
    const handleShowSystemInfo = () => {
        window.open("/about.html", "_blank"); // Открываем страницу about.html в новой вкладке
    };

    return (
        <div className="about-page">
            <h1>
                Самарский университет, институт информатики и кибернетики,
                кафедра программных систем
            </h1>
            <h2>
                Курсовой проект по дисциплине "Программная инженерия" по теме
                "Автоматизированная система бронирования билетов в кинотеатре"
            </h2>
            <h3>Разработчики (обучающиеся группы 6401-020302D):</h3>
            <ul>
                <li>Трухова А.В.</li>
                <li>Сенгилейцев Н.С.</li>
                <li>Саблин С.И.</li>
            </ul>
            <button onClick={handleShowSystemInfo}>О системе</button>
            {/* Кнопка для перехода на главную */}
            <Link to="/">
                <button className="go-home-button">На главную</button>
            </Link>
        </div>
    );
};

export default AboutPage;
