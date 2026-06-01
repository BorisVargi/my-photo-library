// import { PrismaClient } from '../src/generated/prisma';

// const prisma = new PrismaClient();
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';

async function seed() {
  await prisma.photo.deleteMany();
  await prisma.trip.deleteMany();

  const passwordHash = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      passwordHash,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@example.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const japanTrip = await prisma.trip.create({
    data: {
      title: 'Japan 2026',
      slug: 'japan-2026',
      date: 'Май 2026',
      description: 'First trip draft',
      country: 'Japan',
      routeSummary: 'Tokyo → Kyoto → Osaka',
      startDate: new Date('2026-05-10'),
      endDate: new Date('2026-05-24'),
      visibility: 'private',
      status: 'draft',
      userId: admin.id,
    },
  });

  const italyTrip = await prisma.trip.create({
    data: {
      title: 'Italy Spring',
      slug: 'italy-spring',
      date: 'Апрель 2026',
      description: 'Spring route with museums, food and walks.',
      country: 'Italy',
      routeSummary: 'Rome',
      startDate: new Date('2026-04-12'),
      endDate: new Date('2026-04-20'),
      visibility: 'public',
      status: 'published',
      userId: admin.id,
    },
  });

  const georgiaTrip = await prisma.trip.create({
    data: {
      title: 'Georgia Mountains',
      slug: 'georgia-mountains',
      date: 'Июнь 2026',
      description: 'Mountains, wine, old towns and scenic roads.',
      country: 'Georgia',
      routeSummary: 'Tbilisi',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-06-10'),
      visibility: 'public',
      status: 'published',
      userId: admin.id,
    },
  });

  await prisma.photo.createMany({
    data: [
      {
        tripId: japanTrip.id,
        url: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=400&q=80',
        title: 'Shibuya Evening',
        caption: 'Crowded crossing lights',
        visibility: 'private',
        isCover: false,
        takenAt: new Date('2026-05-12'),
      },
      {
        tripId: japanTrip.id,
        url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80',
        title: 'Tokyo Tower',
        visibility: 'public',
        isCover: true,
      },
      {
        tripId: italyTrip.id,
        url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=400&q=80',
        title: 'Colosseum Morning',
        visibility: 'public',
        isCover: true,
      },
      {
        tripId: italyTrip.id,
        url: 'https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?auto=format&fit=crop&w=400&q=80',
        caption: 'Quiet Trastevere street',
        visibility: 'public',
        isCover: false,
      },
      {
        tripId: georgiaTrip.id,
        url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80',
        title: 'Mountain road',
        visibility: 'public',
        isCover: true,
      },
      {
        tripId: georgiaTrip.id,
        url: 'https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?auto=format&fit=crop&w=400&q=80',
        caption: 'Hidden valley stop',
        visibility: 'private',
        isCover: false,
      },
      {
        tripId: georgiaTrip.id,
        url: 'https://images.unsplash.com/photo-1601823984263-b87b59798b70?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1601823984263-b87b59798b70?auto=format&fit=crop&w=400&q=80',
        title: 'Old town',
        visibility: 'public',
        isCover: false,
      },
    ],
  });
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
