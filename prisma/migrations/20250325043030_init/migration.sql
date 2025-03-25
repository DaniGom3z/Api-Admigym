/*
  Warnings:

  - You are about to drop the column `userId` on the `membership` table. All the data in the column will be lost.
  - Added the required column `memberId` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `membership` DROP FOREIGN KEY `Membership_userId_fkey`;

-- DropIndex
DROP INDEX `Membership_userId_fkey` ON `membership`;

-- AlterTable
ALTER TABLE `membership` DROP COLUMN `userId`,
    ADD COLUMN `memberId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Membership` ADD CONSTRAINT `Membership_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
