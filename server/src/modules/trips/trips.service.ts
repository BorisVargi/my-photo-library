import { prisma } from '../../lib/prisma';
import type { Status, Visibility } from '../../shared/constants';
import type {
  CreateTripInput,
  UpdateTripInput,
  CreateTripCityInput,
  UpdateTripCityInput,
} from './trips.schemas';

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
      _count: {
        select: {
          photos: true,
        },
      },
      },
    })}

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

export async function getTripCities(tripId: string, userId: string) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!trip) {
    return [];
  }

  return prisma.tripCity.findMany({
    where: {
      tripId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

export async function createTripCity(
  tripId: string,
  userId: string,
  data: CreateTripCityInput
) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!trip) {
    throw new Error('Trip not found');
  }

  return prisma.tripCity.create({
    data: {
      tripId,
      name: data.name,
      country: data.country ?? null,
      lat: data.lat,
      lng: data.lng,
      order: data.order ?? 0,
    },
  });
}

export async function deleteTripCity(cityId: string, userId: string) {
  const city = await prisma.tripCity.findFirst({
    where: {
      id: cityId,
      trip: {
        userId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!city) {
    throw new Error('City not found');
  }

  return prisma.tripCity.delete({
    where: {
      id: cityId,
    },
  });
}

export async function updateTripCity(
  cityId: string,
  userId: string,
  data: UpdateTripCityInput
) {
  const city = await prisma.tripCity.findFirst({
    where: {
      id: cityId,
      trip: {
        userId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!city) {
    throw new Error('City not found');
  }

  return prisma.tripCity.update({
    where: {
      id: cityId,
    },
    data: {
      order: data.order,
    },
  });
}
