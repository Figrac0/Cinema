import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.scss";

const Navbar = ({ user, toggleModal, handleLogout }) => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/");
    };

    return (
        <header className="navbar">
            <div className="logo" onClick={handleLogoClick}>
                Кинотеатр
            </div>

            {user ? (
                <div className="user-info">
                    <div
                        className="user-name"
                        onClick={() => navigate("/profile")}
                    >
                        Кабинет
                    </div>

                    <div
                        className="gradient-circle"
                        onClick={() => navigate("/profile")}
                    ></div>

                    <div className="separator"></div>

                    <button className="login-btn" onClick={handleLogout}>
                        Выход
                    </button>
                </div>
            ) : (
                <button
                    className="login-btn"
                    onClick={() => toggleModal("login")}
                >
                    Войти
                </button>
            )}
        </header>
    );
};

export default Navbar;
