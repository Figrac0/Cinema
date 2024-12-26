import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import AppBanner from "../appBanner/AppBanner";
import MovieList from "../movieList/MovieList";
import SortFilter from "../sortFilter/SortFilter";
import LoginModal from "../loginModal/LoginModal";
import { movies } from "../../data/movies";
import MovieDetail from "../MovieDetail/MovieDetail";
import UserProfile from "../userProfile/UserProfile";
import "./App.scss";

const App = () => {
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
        setModalOpen(false);
        setModalType(null);
    };

    const handleLogout = () => {
        setUser(null);
    };

    const sortedMovies = movies.sort((a, b) => {
        const getFirstSessionDate = (movie) =>
            movie.sessions && movie.sessions.length > 0
                ? new Date(movie.sessions[0].date)
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
        <Router>
            <div className="app">
                <Navbar
                    user={user}
                    toggleModal={() => toggleModal("login")}
                    handleLogout={handleLogout}
                />
                <AppBanner />
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
                                    addBooking={addBooking} // Передача функции
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
                </Routes>
            </div>
        </Router>
    );
};

export default App;
