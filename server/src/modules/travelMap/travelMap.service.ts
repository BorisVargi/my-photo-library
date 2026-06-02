import { prisma } from '../../lib/prisma';

export async function getTravelMapCities(userId: string) {
  return prisma.tripCity.findMany({
    where: {
      trip: {
        userId,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      trip: {
        select: {
          id: true,
          title: true,
          slug: true,
          country: true,
        },
      },
    },
  });
}
