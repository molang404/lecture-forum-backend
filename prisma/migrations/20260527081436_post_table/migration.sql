/*
  Warnings:

  - You are about to drop the column `deleteAt` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Post` DROP COLUMN `deleteAt`,
    ADD COLUMN `deletedAt` DATETIME(3) NULL;
