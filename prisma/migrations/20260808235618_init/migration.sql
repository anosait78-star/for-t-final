-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "course_name" TEXT NOT NULL,
    "course_description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaches" (
    "id" SERIAL NOT NULL,
    "coach_name" TEXT NOT NULL,
    "bio" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coaches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accredited_foundations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accredited_foundations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "certificate_code" TEXT NOT NULL,
    "student_name" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "national_number" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "student_picture_url" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Egypt',
    "accredited_foundation_id" INTEGER NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("certificate_code")
);

-- CreateIndex
CREATE INDEX "certificates_national_number_idx" ON "certificates"("national_number");

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_accredited_foundation_id_fkey" FOREIGN KEY ("accredited_foundation_id") REFERENCES "accredited_foundations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
