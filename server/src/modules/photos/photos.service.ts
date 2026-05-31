import { prisma } from '../../lib/prisma';
import type { CreatePhotoInput, UpdatePhotoInput } from './photos.schemas';

export async function getPhotosByTripId(tripId: string, userId: string) {
  return prisma.photo.findMany({
    where: {
      tripId,
      trip: {
        userId,
      },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function createPhoto(
  tripId: string,
  userId: string,
  data: CreatePhotoInput
) 

{
  const trip = await prisma.trip.findFirst({
  where: {
    id: tripId,
    userId,
  },
});

if (!trip) {
  return null;
}

  return prisma.photo.create({
    data: {
      tripId,
      url: data.url,
      thumbnailUrl: data.thumbnailUrl,
      title: data.title,
      caption: data.caption,
      visibility: data.visibility ?? 'private',
      isCover: data.isCover ?? false,
      takenAt: data.takenAt ? new Date(data.takenAt) : undefined,
      originalFileName: data.originalFileName,
      fileSize: data.fileSize,
    },
  });
}

export async function updatePhoto(
  id: string,
  userId: string,
  data: UpdatePhotoInput
)
{
  return prisma.photo.updateMany({
    where: {
      id,
      trip: {
        userId,
      },
    },
    data,
  });
}

export async function deletePhoto(id: string, userId: string) {
  return prisma.photo.deleteMany({
    where: { id,
      trip: {
        userId
      }
     },
  });
}

export async function setPhotoAsCover(id: string, userId: string) {
  const photo = await prisma.photo.findFirst({
    where: {
      id,
      trip: {
        userId,
      },
    },
  });

  if (!photo) {
    return null;
  }

  const updatedPhoto = await prisma.$transaction(async (tx) => {
    await tx.photo.updateMany({
      where: {
        tripId: photo.tripId,
        trip: {
          userId,
        },
        isCover: true,
      },
      data: {
        isCover: false,
      },
    });

    return tx.photo.update({
      where: { id },
      data: {
        isCover: true,
      },
    });
  });

  return updatedPhoto;
}
