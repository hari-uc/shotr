-- CreateTable
CREATE TABLE "topics" (
    "topic_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("topic_id")
);

-- CreateTable
CREATE TABLE "shortened_links" (
    "link_id" TEXT NOT NULL,
    "long_url" TEXT NOT NULL,
    "topic_id" TEXT,
    "user_id" TEXT NOT NULL,
    "is_custom_alias" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shortened_links_pkey" PRIMARY KEY ("link_id")
);

-- CreateTable
CREATE TABLE "click_events" (
    "event_id" SERIAL NOT NULL,
    "link_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "user_agent" TEXT,
    "os" TEXT,
    "device_type" TEXT,
    "geolocation" TEXT,
    "meta" JSONB,

    CONSTRAINT "click_events_pkey" PRIMARY KEY ("event_id")
);

-- CreateIndex
CREATE INDEX "topics_user_id_idx" ON "topics"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "topics_name_user_id_key" ON "topics"("name", "user_id");

-- CreateIndex
CREATE INDEX "shortened_links_user_id_idx" ON "shortened_links"("user_id");

-- CreateIndex
CREATE INDEX "shortened_links_created_at_idx" ON "shortened_links"("created_at");

-- CreateIndex
CREATE INDEX "click_events_link_id_idx" ON "click_events"("link_id");

-- CreateIndex
CREATE INDEX "click_events_timestamp_idx" ON "click_events"("timestamp");

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shortened_links" ADD CONSTRAINT "shortened_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shortened_links" ADD CONSTRAINT "shortened_links_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("topic_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "click_events" ADD CONSTRAINT "click_events_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "shortened_links"("link_id") ON DELETE RESTRICT ON UPDATE CASCADE;
