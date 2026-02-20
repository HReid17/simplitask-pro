import { z } from 'zod';

// Register validation
const registerSchema = z.object({
    email: z
        .email({ message: 'Email must be a valid email address' })
        .transform((val) => val.trim().toLowerCase()),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
});

export const validateRegister = (req, res, next) => {
    try {
        req.body = registerSchema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({
            message: "Invalid request data",
            errors: err.errors,
        });
    }
};

// Login validation

const loginSchema = z.object({
    email: z
        .email({ message: 'Email must be a valid email address' })
        .transform((val) => val.trim().toLowerCase()),

    password: z
        .string()
        .min(1, "Password required")
});

export const validateLogin = (req, res, next) => {
    try {
        req.body = loginSchema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({
            message: "Invalid request data",
            errors: err.errors,
        });
    }
};