import { prisma } from '../../lib/prisma';
import type { Status, Visibility } from '../../shared/constants';
import type { CreateTripInput, UpdateTripInput } from './trips.schemas';

export async function getAllTrips(userId: string) {
  return prisma.trip.findMany({
    where: { userId },
    orderBy: { startDate: 'desc' },
    include: {
      photos: {
        where: {
          isCover: true,
        },
        take: 1,
      },
    },
  });
}

export const getTripById = async (id: string, userId: string) => {
  return prisma.trip.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      photos: true,
    },
  });
};

export async function createTrip(userId: string, data: CreateTripInput) {
  return prisma.trip.create({
    data: {
      ...data,
      userId,
      visibility: data.visibility ?? 'private',
      status: data.status ?? 'draft',
    },
  });
}

export async function updateTrip(
  id: string,
  userId: string,
  data: UpdateTripInput
) {
  return prisma.trip.updateMany({
    where: { id, userId },
    data,
  });
}

export async function getTripOwnerVisibility(id: string, userId: string) {
  return prisma.trip.findFirst({
    where: { id, userId },
    select: {
      id: true,
      visibility: true,
    },
  });
}

export async function makeTripPhotosPublic(tripId: string) {
  return prisma.photo.updateMany({
    where: { tripId },
    data: {
      visibility: 'public',
    },
  });
}

export async function deleteTrip(id: string,userId: string) {
  return prisma.trip.deleteMany({
    where: { id, userId},
  });
}
