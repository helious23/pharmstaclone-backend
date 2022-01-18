/*
  Warnings:

  - A unique constraint covering the columns `[photoId,userId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Comment_photoId_userId_key" ON "Comment"("photoId", "userId");
