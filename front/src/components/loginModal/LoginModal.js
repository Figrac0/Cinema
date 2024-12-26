import React, { useState, useEffect } from "react";
import { loginUser, registerUser } from "../../services/auth";

import "./LoginModal.scss";

const LoginModal = ({ closeModal, onLoginSuccess, modalType }) => {
    const [isLogin, setIsLogin] = useState(modalType === "login");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        lastName: "",
        firstName: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "firstName" || name === "lastName") {
            setFormData((prev) => ({
                ...prev,
                [name]: value.charAt(0).toUpperCase() + value.slice(1),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Поле e-mail обязательно";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Введите корректный e-mail";
        }

        if (!formData.password) {
            newErrors.password = "Поле пароль обязательно";
        } else if (formData.password.length < 8) {
            newErrors.password = "Пароль должен содержать не менее 8 символов";
        } else if (formData.password.length > 20) {
            newErrors.password = "Пароль не должен превышать 20 символов";
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Пароли не совпадают";
        }

        if (!isLogin) {
            if (!formData.lastName) {
                newErrors.lastName = "Поле фамилия обязательно";
            } else if (formData.lastName.length < 3) {
                newErrors.lastName =
                    "Фамилия должна содержать минимум 3 символа";
            } else if (formData.lastName.length > 13) {
                newErrors.lastName =
                    "Фамилия не может быть длиннее 13 символов";
            }

            if (!formData.firstName) {
                newErrors.firstName = "Поле имя обязательно";
            } else if (formData.firstName.length < 3) {
                newErrors.firstName = "Имя должно содержать минимум 3 символа";
            } else if (formData.firstName.length > 13) {
                newErrors.firstName = "Имя не может быть длиннее 13 символов";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const requestData = {
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirmPassword,
            ...(isLogin
                ? {}
                : {
                      first_name: formData.firstName,
                      last_name: formData.lastName,
                  }),
        };

        console.log(requestData);

        try {
            let response;
            if (isLogin) {
                response = await loginUser(requestData);
            } else {
                response = await registerUser(requestData);
            }

            if (response.access) {
                localStorage.setItem("access_token", response.access);
                onLoginSuccess({
                    name: isLogin ? response.name : formData.firstName,
                });
                closeModal();
            }
        } catch (error) {
            console.error(
                "Ошибка при регистрации/входе:",
                error.response ? error.response.data : error.message
            );
            setErrors({ general: "Ошибка при регистрации/входе" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        return () => {
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "0px";
        };
    }, []);

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button
                        className={`tab ${isLogin ? "active" : ""}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Вход
                    </button>
                    <button
                        className={`tab ${!isLogin ? "active" : ""}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Регистрация
                    </button>
                    <button className="close-btn" onClick={closeModal}>
                        ×
                    </button>
                </div>
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Ваш e-mail"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.email && (
                            <div className="error">{errors.email}</div>
                        )}

                        <input
                            type="password"
                            name="password"
                            placeholder="Ваш пароль"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.password && (
                            <div className="error">{errors.password}</div>
                        )}

                        {!isLogin && (
                            <>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Повторите пароль"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.confirmPassword && (
                                    <div className="error">
                                        {errors.confirmPassword}
                                    </div>
                                )}

                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Ваша фамилия"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.lastName && (
                                    <div className="error">
                                        {errors.lastName}
                                    </div>
                                )}

                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Ваше имя"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.firstName && (
                                    <div className="error">
                                        {errors.firstName}
                                    </div>
                                )}
                            </>
                        )}

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Загрузка..."
                                : isLogin
                                ? "Войти"
                                : "Регистрация"}
                        </button>

                        {errors.general && (
                            <div className="error">{errors.general}</div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
