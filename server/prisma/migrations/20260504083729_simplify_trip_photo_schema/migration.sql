/*
  Warnings:

  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MediaTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TripNote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_tripId_fkey";

-- DropForeignKey
ALTER TABLE "MediaTag" DROP CONSTRAINT "MediaTag_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "MediaTag" DROP CONSTRAINT "MediaTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "TripNote" DROP CONSTRAINT "TripNote_tripId_fkey";

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "date" TEXT,
ADD COLUMN     "publicDescription" TEXT;

-- DropTable
DROP TABLE "Media";

-- DropTable
DROP TABLE "MediaTag";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "TripNote";

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "title" TEXT,
    "caption" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "takenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
