import express from 'express';
import { body } from 'express-validator';
import { register, login, me, updateMe, deleteMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post(
    '/register',
    [
        body('email')
            .isEmail()
            .withMessage('Valid email is required')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters'),
        body('companyName')
            .notEmpty()
            .withMessage('Company name is required')
    ],
    register
);

router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Valid email is required')
            .normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ],
    login
);

router.get('/me', authenticate, me);

router.patch(
    '/me',
    authenticate,
    [
        body('email')
            .optional()
            .isEmail()
            .withMessage('Valid email is required')
            .normalizeEmail(),
        body('password')
            .optional()
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters'),
        body().custom((value, { req }) => {
            const hasEmail = Object.prototype.hasOwnProperty.call(req.body, 'email');
            const hasPassword = Object.prototype.hasOwnProperty.call(req.body, 'password');

            if (!hasEmail && !hasPassword) {
                throw new Error('Please provide an email or password to update');
            }

            return true;
        })
    ],
    updateMe
);

router.delete('/me', authenticate, deleteMe);

export default router;
