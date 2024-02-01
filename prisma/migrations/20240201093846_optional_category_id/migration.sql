-- DropForeignKey
ALTER TABLE `service` DROP FOREIGN KEY `Service_categoryId_fkey`;

-- AlterTable
ALTER TABLE `service` MODIFY `categoryId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
