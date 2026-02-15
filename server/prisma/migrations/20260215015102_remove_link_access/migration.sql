/*
  Warnings:

  - You are about to drop the `link_accesses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "link_accesses" DROP CONSTRAINT "link_accesses_link_id_fkey";

-- DropTable
DROP TABLE "link_accesses";
