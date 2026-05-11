-- AlterEnum
ALTER TYPE "MessageType" ADD VALUE 'FILE';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "mediaUrl" TEXT,
ADD COLUMN     "mimeType" TEXT;
