-- AlterTable
ALTER TABLE "User" ADD COLUMN     "invited_by_id" TEXT;

-- CreateIndex
CREATE INDEX "User_invited_by_id_idx" ON "User"("invited_by_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
