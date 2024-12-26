import React, { useState, useEffect } from "react";
import "./LoginModal.scss";

const LoginModal = ({ closeModal, onLoginSuccess, modalType }) => {
    const [isLogin, setIsLogin] = useState(modalType === "login"); // Устанавливаем состояние для входа/регистрации
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "", // Для подтверждения пароля
        lastName: "", // Для фамилии
        firstName: "", // Для имени
    });
    const [errors, setErrors] = useState({}); // Для ошибок валидации

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

        // Валидация email
        if (!formData.email) {
            newErrors.email = "Поле e-mail обязательно";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Введите корректный e-mail";
        }

        // Валидация пароля
        if (!formData.password) {
            newErrors.password = "Поле пароль обязательно";
        } else if (formData.password.length < 8) {
            newErrors.password = "Пароль должен содержать не менее 8 символов";
        }

        // Валидация подтверждения пароля
        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Пароли не совпадают";
        }

        // Валидация фамилии и имени для регистрации
        if (!isLogin) {
            // Валидация фамилии
            if (!formData.lastName) {
                newErrors.lastName = "Поле фамилия обязательно";
            } else if (formData.lastName.length < 3) {
                newErrors.lastName =
                    "Фамилия должна содержать минимум 3 символа";
            } else if (formData.lastName.length > 9) {
                newErrors.lastName = "Фамилия не может быть длиннее 9 символов";
            }

            // Валидация имени
            if (!formData.firstName) {
                newErrors.firstName = "Поле имя обязательно";
            } else if (formData.firstName.length < 3) {
                newErrors.firstName = "Имя должно содержать минимум 3 символа";
            } else if (formData.firstName.length > 9) {
                newErrors.firstName = "Имя не может быть длиннее 9 символов";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Если нет ошибок, форма валидна
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Если форма не валидна, не отправляем
        }

        if (isLogin) {
            // Логика входа (можно добавить API запрос)
            onLoginSuccess({ name: "Пользователь" }); // Пример успешного входа
        } else {
            // Логика регистрации
            onLoginSuccess({ name: formData.firstName }); // Передаем имя для регистрации
        }

        closeModal(); // Закрываем модальное окно после успешной регистрации/входа
    };

    useEffect(() => {
        // Блокируем прокрутку при открытом модальном окне
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

                        <button type="submit" className="submit-btn">
                            {isLogin ? "Войти" : "Регистрация"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
