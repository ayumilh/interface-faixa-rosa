-- CreateTable
CREATE TABLE `PaymentMethodCompanion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companionId` INTEGER NOT NULL,
    `paymentMethod` ENUM('CARTAO_CREDITO', 'PIX', 'LUXO', 'ECONOMICAS') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgeCategoryCompanion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companionId` INTEGER NOT NULL,
    `ageCategory` ENUM('COROAS', 'NINFETAS') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AtendimentoCompanion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companionId` INTEGER NOT NULL,
    `atendimento` ENUM('HOMENS', 'MULHERES', 'CASAIS', 'DEFICIENTES_FISICOS') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactMethodCompanion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companionId` INTEGER NOT NULL,
    `contactMethod` ENUM('LIGACAO', 'WHATSAPP', 'TELEGRAM') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EtniaCompanion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companionId` INTEGER NOT NULL,
    `etnia` ENUM('BRANCAS', 'LATINAS', 'MULATAS', 'NEGRAS', 'ORIENTAIS') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CabeloCompanion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companionId` INTEGER NOT NULL,
    `cabelo` ENUM('MORENAS', 'LOIRAS', 'RUIVAS') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstaturaCompanion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companionId` INTEGER NOT NULL,
    `estatura` ENUM('ALTAS', 'MIGNON') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CorpoCompanion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companionId` INTEGER NOT NULL,
    `corpo` ENUM('GORDINHAS', 'MAGRAS') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeiosCompanion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companionId` INTEGER NOT NULL,
    `seios` ENUM('PEITUDAS', 'SEIOS_NATURAIS') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PubisCompanion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companionId` INTEGER NOT NULL,
    `pubis` ENUM('PELUDAS', 'DEPILADO') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServicosGeraisCompanion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companionId` INTEGER NOT NULL,
    `servico` ENUM('BEIJOS_BOCA', 'EJACULACAO_CORPO', 'FACIAL', 'FANTASIAS_DISFARCES', 'MASSAGEM_EROTICA', 'NAMORADINHA', 'ORAL_SEM_CAMISINHA', 'ORAL_COM_CAMISINHA', 'SEXO_ANAL', 'PSE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServicosEspeciaisCompanion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companionId` INTEGER NOT NULL,
    `servico` ENUM('BEIJO_NEGRO', 'CHUVA_DOURADA', 'FETICHISMO', 'GARGANTA_PROFUNDA', 'SADO_DURO', 'SADO_SUAVE', 'SQUIRTING', 'STRAP_ON') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LugarCompanion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companionId` INTEGER NOT NULL,
    `lugar` ENUM('A_DOMICILIO', 'CLUBE_SWING', 'COM_LOCAL', 'DESPEDIDAS_SOLTEIRO', 'FESTAS_EVENTOS', 'HOTEL', 'JANTAR_ROMANTICO', 'VIAGENS') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PaymentMethodCompanion` ADD CONSTRAINT `PaymentMethodCompanion_companionId_fkey` FOREIGN KEY (`companionId`) REFERENCES `Companion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgeCategoryCompanion` ADD CONSTRAINT `AgeCategoryCompanion_companionId_fkey` FOREIGN KEY (`companionId`) REFERENCES `Companion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AtendimentoCompanion` ADD CONSTRAINT `AtendimentoCompanion_companionId_fkey` FOREIGN KEY (`companionId`) REFERENCES `Companion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactMethodCompanion` ADD CONSTRAINT `ContactMethodCompanion_companionId_fkey` FOREIGN KEY (`companionId`) REFERENCES `Companion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EtniaCompanion` ADD CONSTRAINT `EtniaCompanion_companionId_fkey` FOREIGN KEY (`companionId`) REFERENCES `Companion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CabeloCompanion` ADD CONSTRAINT `CabeloCompanion_companionId_fkey` FOREIGN KEY (`companionId`) REFERENCES `Companion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EstaturaCompanion` ADD CONSTRAINT `EstaturaCompanion_companionId_fkey` FOREIGN KEY (`companionId`) REFERENCES `Companion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CorpoCompanion` ADD CONSTRAINT `CorpoCompanion_companionId_fkey` FOREIGN KEY (`companionId`) REFERENCES `Companion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeiosCompanion` ADD CONSTRAINT `SeiosCompanion_companionId_fkey` FOREIGN KEY (`companionId`) REFERENCES `Companion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PubisCompanion` ADD CONSTRAINT `PubisCompanion_companionId_fkey` FOREIGN KEY (`companionId`) REFERENCES `Companion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicosGeraisCompanion` ADD CONSTRAINT `ServicosGeraisCompanion_companionId_fkey` FOREIGN KEY (`companionId`) REFERENCES `Companion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicosEspeciaisCompanion` ADD CONSTRAINT `ServicosEspeciaisCompanion_companionId_fkey` FOREIGN KEY (`companionId`) REFERENCES `Companion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LugarCompanion` ADD CONSTRAINT `LugarCompanion_companionId_fkey` FOREIGN KEY (`companionId`) REFERENCES `Companion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
