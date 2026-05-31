// import type { Request, Response } from 'express';
// import { loginUser } from './auth.service';

// export const loginController = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         message: 'email and password are required',
//       });
//     }

//     const result = await loginUser(email, password);

//     if (!result) {
//       return res.status(401).json({
//         message: 'Invalid email or password',
//       });
//     }

//     return res.json(result);
//   } catch (error) {
//     console.error('Failed to login', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };
