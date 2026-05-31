import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { signToken } from '../../lib/jwt';
import { authMiddleware } from '../../middleware/auth.middleware';

export const authRouter = Router();

/**
 * Создание admin пользователя (один раз)
 */
authRouter.post('/seed-admin', async (_req, res, next) => {
  try {
    const email = 'admin@example.com';
    const password = '123456';

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.json({
        message: 'Admin already exists',
        email: existingUser.email,
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'ADMIN',
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: 'Admin created',
      user,
      login: {
        email,
        password,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Login пользователя
 */
authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: 'Email and password are required',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        message: 'Invalid email or password',
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({
        message: 'Invalid email or password',
      });
      return;
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.get('/me', authMiddleware, async (req, res) => {
  res.json({
    user: req.user,
  });
});
