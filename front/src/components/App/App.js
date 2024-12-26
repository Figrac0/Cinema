import React, { useState, useCallback, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation,
} from "react-router-dom";
import Navbar from "../navbar/Navbar";
import AppBanner from "../appBanner/AppBanner";
import MovieList from "../movieList/MovieList";
import SortFilter from "../sortFilter/SortFilter";
import LoginModal from "../loginModal/LoginModal";
import MovieDetail from "../MovieDetail/MovieDetail";
import UserProfile from "../userProfile/UserProfile";
import { getMovies } from "../../services/movies";
import { FaSpinner } from "react-icons/fa";
import AboutPage from "../pages/AboutPage";

import "./App.scss";

const App = () => {
    const location = useLocation(); // now this is valid because it's inside Router
    const [isModalOpen, setModalOpen] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [modalType, setModalType] = useState("login");
    const [filters, setFilters] = useState({
        searchQuery: "",
        selectedDate: null,
        selectedGenre: null,
        selectedHallType: null,
    });
    const [sortByDate, setSortByDate] = useState(null);
    const [user, setUser] = useState(null);

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const fetchMovies = async () => {
            try {
                const fetchedMovies = await getMovies();
                setMovies(fetchedMovies);
            } catch (err) {
                setError("Ошибка при загрузке фильмов");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const addBooking = (newBooking) => {
        setBookings((prevBookings) => [...prevBookings, newBooking]);
    };

    const onFilterChange = useCallback((filterValues) => {
        setFilters((prev) => ({
            ...prev,
            ...filterValues,
        }));
    }, []);

    const toggleModal = (type) => {
        setModalType(type);
        setModalOpen(true);
    };

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setModalOpen(false);
        setModalType(null);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
    };

    // Фильтрация и сортировка фильмов
    const sortedMovies = movies.sort((a, b) => {
        const getFirstSessionDate = (movie) =>
            movie.sessions && movie.sessions.length > 0
                ? new Date(movie.sessions[0].start_time)
                : new Date(0);

        const dateA = getFirstSessionDate(a);
        const dateB = getFirstSessionDate(b);

        if (sortByDate === "asc") {
            return dateA - dateB;
        }
        if (sortByDate === "desc") {
            return dateB - dateA;
        }
        return 0;
    });

    return (
        <div className="app">
            {/* Для всех страниц, кроме /about, показываем Navbar и AppBanner */}
            {location.pathname !== "/about" && (
                <>
                    <Navbar
                        user={user}
                        toggleModal={() => toggleModal("login")}
                        handleLogout={handleLogout}
                    />
                    <AppBanner />
                </>
            )}

            {loading && (
                <div className="app_loading">
                    <FaSpinner className="loading-icon" />
                </div>
            )}

            {error && <div>{error}</div>}

            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <SortFilter
                                onFilterChange={onFilterChange}
                                sortByDate={sortByDate}
                                setSortByDate={setSortByDate}
                            />
                            <MovieList
                                movies={sortedMovies}
                                filters={filters}
                            />
                            {isModalOpen && modalType === "login" && (
                                <LoginModal
                                    modalType={modalType}
                                    closeModal={() => {
                                        setModalOpen(false);
                                        setModalType(null);
                                    }}
                                    onLoginSuccess={handleLoginSuccess}
                                />
                            )}
                        </>
                    }
                />
                <Route
                    path="/movie/:id"
                    element={
                        <>
                            <MovieDetail
                                user={user}
                                toggleModal={() => toggleModal("login")}
                                addBooking={addBooking}
                            />
                            {isModalOpen && modalType === "login" && (
                                <LoginModal
                                    modalType={modalType}
                                    closeModal={() => {
                                        setModalOpen(false);
                                        setModalType(null);
                                    }}
                                    onLoginSuccess={handleLoginSuccess}
                                />
                            )}
                        </>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <>
                            <UserProfile bookings={bookings} />
                            {isModalOpen && modalType === "login" && (
                                <LoginModal
                                    modalType={modalType}
                                    closeModal={() => {
                                        setModalOpen(false);
                                        setModalType(null);
                                    }}
                                    onLoginSuccess={handleLoginSuccess}
                                />
                            )}
                        </>
                    }
                />

                {/* Страница справочной информации */}
                <Route path="/about" element={<AboutPage />} />
            </Routes>

            {/* Кнопка для перехода на страницу "Справочная информация" */}
            {location.pathname !== "/about" && (
                <footer className="footer">
                    <Link to="/about">
                        <button className="info-button">
                            Справочная информация
                        </button>
                    </Link>
                </footer>
            )}
        </div>
    );
};

const Root = () => (
    <Router>
        <App />
    </Router>
);

export default Root;
