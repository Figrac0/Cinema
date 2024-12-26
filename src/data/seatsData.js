export const seatsStandard = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    row: Math.floor(i / 10) + 1, // 4 ряда по 10 мест
    seat: (i % 10) + 1,
    price: Math.floor(i / 10) + 1 <= 2 ? 300 : 400, // 1-2 ряд: 300, 3-4 ряд: 400
    status: "free",
}));

export const seatsComfort = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    row: Math.floor(i / 10) + 1,
    seat: (i % 10) + 1,
    price: Math.floor(i / 10) + 1 <= 2 ? 400 : 550, // 1-2 ряд: 400, 3-4 ряд: 550
    status: "free",
}));

export const seatsVIP = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    row: Math.floor(i / 10) + 1,
    seat: (i % 10) + 1,
    price: Math.floor(i / 10) + 1 <= 2 ? 500 : 650, // 1-2 ряд: 500, 3-4 ряд: 650
    status: "free",
}));
