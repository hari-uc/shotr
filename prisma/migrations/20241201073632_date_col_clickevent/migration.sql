/*
  Warnings:

  - Added the required column `date` to the `click_events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "click_events" ADD COLUMN     "date" DATE NOT NULL;

-- CreateIndex
CREATE INDEX "click_events_date_idx" ON "click_events"("date");
