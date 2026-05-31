import { prisma } from '../../lib/prisma';

export async function getPublicTrips() {
  return prisma.trip.findMany({
    where: {
      visibility: 'public',
      status: 'published',
    },
    orderBy: {
      startDate: 'desc',
    },
    include: {
      photos: {
        where: {
          visibility: 'public',
          isCover: true,
        },
        take: 1,
      },
    },
  });
}

export async function getPublicTripBySlug(slug: string) {
  return prisma.trip.findFirst({
    where: {
      slug,
      visibility: 'public',
      status: 'published',
    },
    include: {
      photos: {
        where: {
          visibility: 'public',
        },
        orderBy: [
          { isCover: 'desc' },
          { createdAt: 'asc' },
        ],
      },
    },
  });
}
