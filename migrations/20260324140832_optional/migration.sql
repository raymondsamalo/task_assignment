-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_developerId_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "developerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
