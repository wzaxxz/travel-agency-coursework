import jwt from "jsonwebtoken";

// Middleware для перевірки наявності та валідності токена
export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ success: false, message: "You're not authorize" });
    }

    // Якщо токен є, перевіряємо його
    // Використовуємо той самий секретний ключ, що і при створенні токена
    const secretKey = process.env.JWT_SECRET || "mernStackAuthSecretKey";

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Token is invalid" });
        }

        req.user = user;
        next(); // Переходимо до наступної функції
    });
};

// Перевірка: чи це саме той користувач, або адмін
export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.role === "admin") {
            next();
        } else {
            return res.status(401).json({ success: false, message: "You're not authenticated" });
        }
    });
};

// Перевірка: чи це адмін
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === "admin") {
            next();
        } else {
            return res.status(401).json({ success: false, message: "You're not authorize" });
        }
    });
};