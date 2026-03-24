-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Done', 'In-Progress', 'To-do');

-- CreateTable
CREATE TABLE "Developer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "Developer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "developerId" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DeveloperToSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SkillToTask" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Developer_name_key" ON "Developer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_DeveloperToSkill_AB_unique" ON "_DeveloperToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_DeveloperToSkill_B_index" ON "_DeveloperToSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SkillToTask_AB_unique" ON "_SkillToTask"("A", "B");

-- CreateIndex
CREATE INDEX "_SkillToTask_B_index" ON "_SkillToTask"("B");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeveloperToSkill" ADD CONSTRAINT "_DeveloperToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeveloperToSkill" ADD CONSTRAINT "_DeveloperToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToTask" ADD CONSTRAINT "_SkillToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToTask" ADD CONSTRAINT "_SkillToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
