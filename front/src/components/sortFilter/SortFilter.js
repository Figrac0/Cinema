import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { getMovies } from "../../services/movies";
import "./SortFilter.scss";

const SortFilter = ({ onFilterChange, setSortByDate, sortByDate }) => {
    const [activeFilter, setActiveFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedHallType, setSelectedHallType] = useState(null);
    const [genres, setGenres] = useState([]); // Состояние для жанров

    const filterRef = useRef();

    // Получаем данные о фильмах и извлекаем уникальные жанры
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const movies = await getMovies();
                const allGenres = new Set();
                movies.forEach((movie) => {
                    movie.genres.forEach((genre) => {
                        allGenres.add(genre.name);
                    });
                });
                setGenres([...allGenres]); // Устанавливаем жанры в состояние
            } catch (error) {
                console.error("Ошибка при получении фильмов:", error);
            }
        };

        fetchMovies();
    }, []);

    // Отслеживаем изменения в фильтрах и передаем обновленные значения
    useEffect(() => {
        onFilterChange({
            searchQuery,
            selectedDate,
            selectedGenre,
            selectedHallType,
        });
    }, [
        searchQuery,
        selectedDate,
        selectedGenre,
        selectedHallType,
        onFilterChange,
    ]);

    // Закрытие фильтров при клике за пределами
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                filterRef.current &&
                !filterRef.current.contains(event.target)
            ) {
                setActiveFilter(null); // Закрываем все аккордеоны
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const toggleFilter = (filter) => {
        setActiveFilter(activeFilter === filter ? null : filter);
    };

    const handleFilterChange = (type, value) => {
        if (type === "date") {
            setSelectedDate(value);
        } else if (type === "genre") {
            setSelectedGenre(value);
        } else if (type === "hallType") {
            setSelectedHallType(value);
        }
        setActiveFilter(null); // Закрываем фильтр сразу после выбора
    };

    const resetFilters = () => {
        setSelectedDate(null);
        setSelectedGenre(null);
        setSelectedHallType(null);
        setSearchQuery("");
    };

    // Сортировка по дате
    const handleSortByDate = () => {
        setSortByDate((prevSort) => (prevSort === "asc" ? "desc" : "asc"));
    };

    return (
        <div className="sort-filter" ref={filterRef}>
            <div className="filters">
                <div className="filter-group">
                    <button onClick={() => toggleFilter("date")}>
                        Дата {activeFilter === "date" ? "▲" : "▼"}
                    </button>
                    {activeFilter === "date" && (
                        <div className="filter-options">
                            <div
                                onClick={() =>
                                    handleFilterChange("date", "Сегодня")
                                }
                                className={
                                    selectedDate === "Сегодня" ? "active" : ""
                                }
                            >
                                Сегодня
                            </div>
                            <div
                                onClick={() =>
                                    handleFilterChange("date", "Завтра")
                                }
                                className={
                                    selectedDate === "Завтра" ? "active" : ""
                                }
                            >
                                Завтра
                            </div>
                            <div
                                onClick={() =>
                                    handleFilterChange(
                                        "date",
                                        "В ближайшее время"
                                    )
                                }
                                className={
                                    selectedDate === "В ближайшее время"
                                        ? "active"
                                        : ""
                                }
                            >
                                В ближайшее время
                            </div>
                        </div>
                    )}
                </div>
                <div className="filter-group">
                    <button onClick={() => toggleFilter("genre")}>
                        Жанр {activeFilter === "genre" ? "▲" : "▼"}
                    </button>
                    {activeFilter === "genre" && (
                        <div className="filter-options">
                            {genres.map((genre) => (
                                <div
                                    key={genre}
                                    onClick={() =>
                                        handleFilterChange("genre", genre)
                                    }
                                    className={
                                        selectedGenre === genre ? "active" : ""
                                    }
                                >
                                    {genre}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="filter-group">
                    <button onClick={() => toggleFilter("hallType")}>
                        Тип зала {activeFilter === "hallType" ? "▲" : "▼"}
                    </button>
                    {activeFilter === "hallType" && (
                        <div className="filter-options">
                            <div
                                onClick={() =>
                                    handleFilterChange("hallType", "Стандарт")
                                }
                                className={
                                    selectedHallType === "Стандарт"
                                        ? "active"
                                        : ""
                                }
                            >
                                Стандарт
                            </div>
                            <div
                                onClick={() =>
                                    handleFilterChange("hallType", "Комфорт")
                                }
                                className={
                                    selectedHallType === "Комфорт"
                                        ? "active"
                                        : ""
                                }
                            >
                                Комфорт
                            </div>
                            <div
                                onClick={() =>
                                    handleFilterChange("hallType", "VIP")
                                }
                                className={
                                    selectedHallType === "VIP" ? "active" : ""
                                }
                            >
                                VIP
                            </div>
                        </div>
                    )}
                </div>

                {/* Кнопка для сортировки по дате */}
                <div className="sort-buttons">
                    <button onClick={handleSortByDate}>
                        По дате
                        {sortByDate === "asc"
                            ? " ↑"
                            : sortByDate === "desc"
                            ? " ↓"
                            : ""}
                    </button>
                </div>

                {/* Кнопка сброса фильтров */}
                <button className="reset-btn" onClick={resetFilters}>
                    <FontAwesomeIcon icon={faSyncAlt} className="fa-2x" />
                </button>
            </div>

            {/* Поиск */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={handleSearch}
                    onFocus={(e) => (e.target.placeholder = "")} // Убираем placeholder при фокусе
                    onBlur={(e) => (e.target.placeholder = "Поиск...")} // Восстанавливаем при потере фокуса
                    style={{ fontSize: "20px", padding: "10px" }}
                />
            </div>
        </div>
    );
};

export default SortFilter;
