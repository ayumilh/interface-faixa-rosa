/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `cpf` VARCHAR(191) NOT NULL,
    ADD COLUMN `userType` ENUM('CONTRATANTE', 'ACOMPANHANTE') NOT NULL DEFAULT 'CONTRATANTE';

-- CreateIndex
CREATE UNIQUE INDEX `User_cpf_key` ON `User`(`cpf`);
