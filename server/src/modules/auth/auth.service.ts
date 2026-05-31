// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { prisma } from '../../lib/prisma';

// export async function loginUser(email: string, password: string) {
//   const user = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (!user) {
//     return null;
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

//   if (!isPasswordValid) {
//     return null;
//   }

//   const jwtSecret = process.env.JWT_SECRET;

//   if (!jwtSecret) {
//     throw new Error('JWT_SECRET is not defined');
//   }

//   const token = jwt.sign(
//     {
//       userId: user.id,
//       email: user.email,
//     },
//     jwtSecret,
//     {
//       expiresIn: '7d',
//     }
//   );

//   return {
//     token,
//     user: {
//       id: user.id,
//       email: user.email,
//       name: user.name,
//       role: user.role,
//     },
//   };
// }
