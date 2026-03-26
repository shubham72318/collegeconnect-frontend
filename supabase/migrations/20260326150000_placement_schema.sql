-- Placement workflow schema:
-- 1) Companies create `drives`
-- 2) Colleges accept/reject drives in `drive_college_approvals`
-- 3) Students can apply only to accepted drives (status: applied/selected/rejected) in `applications`

-- Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'drive_college_decision') THEN
    CREATE TYPE public.drive_college_decision AS ENUM ('accepted', 'rejected');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
    CREATE TYPE public.application_status AS ENUM ('applied', 'selected', 'rejected');
  END IF;
END $$;

-- Drives (company submissions)
CREATE TABLE IF NOT EXISTS public.drives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  package TEXT NOT NULL,
  vacancies INTEGER NOT NULL CHECK (vacancies >= 0),
  visit_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.drives ENABLE ROW LEVEL SECURITY;

-- Companies can create drives
DROP POLICY IF EXISTS "Companies can insert drives" ON public.drives;
CREATE POLICY "Companies can insert drives"
  ON public.drives
  FOR INSERT
  WITH CHECK (
    company_user_id = auth.uid()
    AND public.has_role(auth.uid(), 'company')
  );

-- Companies can view their drives
DROP POLICY IF EXISTS "Companies can view own drives" ON public.drives;
CREATE POLICY "Companies can view own drives"
  ON public.drives
  FOR SELECT
  USING (
    company_user_id = auth.uid()
    AND public.has_role(auth.uid(), 'company')
  );

-- Colleges can view all drives to decide
DROP POLICY IF EXISTS "Colleges can view all drives" ON public.drives;
CREATE POLICY "Colleges can view all drives"
  ON public.drives
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'college')
  );

-- Students can view drives accepted by their college
DROP POLICY IF EXISTS "Students can view accepted drives" ON public.drives;
CREATE POLICY "Students can view accepted drives"
  ON public.drives
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'student')
    AND EXISTS (
      SELECT 1
      FROM public.drive_college_approvals a
      WHERE a.drive_id = drives.id
        AND a.status = 'accepted'
        AND a.college_name = (
          SELECT p.college_name
          FROM public.profiles p
          WHERE p.user_id = auth.uid()
        )
    )
  );

-- Drive approvals per college
CREATE TABLE IF NOT EXISTS public.drive_college_approvals (
  drive_id UUID NOT NULL REFERENCES public.drives(id) ON DELETE CASCADE,
  college_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  college_name TEXT NOT NULL,
  status public.drive_college_decision NOT NULL,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (drive_id, college_user_id)
);

ALTER TABLE public.drive_college_approvals ENABLE ROW LEVEL SECURITY;

-- Colleges can create/update their decisions
DROP POLICY IF EXISTS "Colleges can upsert drive approvals" ON public.drive_college_approvals;
CREATE POLICY "Colleges can upsert drive approvals"
  ON public.drive_college_approvals
  FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'college')
    AND college_user_id = auth.uid()
    AND college_name = (
      SELECT p.college_name
      FROM public.profiles p
      WHERE p.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Colleges can update drive approvals" ON public.drive_college_approvals;
CREATE POLICY "Colleges can update drive approvals"
  ON public.drive_college_approvals
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'college')
    AND college_user_id = auth.uid()
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'college')
    AND college_user_id = auth.uid()
    AND college_name = (
      SELECT p.college_name
      FROM public.profiles p
      WHERE p.user_id = auth.uid()
    )
  );

-- Students can read accepted approvals for their college name
DROP POLICY IF EXISTS "Students can read accepted approvals" ON public.drive_college_approvals;
CREATE POLICY "Students can read accepted approvals"
  ON public.drive_college_approvals
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'student')
    AND status = 'accepted'
    AND college_name = (
      SELECT p.college_name
      FROM public.profiles p
      WHERE p.user_id = auth.uid()
    )
  );

-- Colleges can read their own decisions
DROP POLICY IF EXISTS "Colleges can read own approvals" ON public.drive_college_approvals;
CREATE POLICY "Colleges can read own approvals"
  ON public.drive_college_approvals
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'college')
    AND college_user_id = auth.uid()
  );

-- Companies can read approvals for drives they posted (optional, used for debugging)
DROP POLICY IF EXISTS "Companies can read approvals for own drives" ON public.drive_college_approvals;
CREATE POLICY "Companies can read approvals for own drives"
  ON public.drive_college_approvals
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'company')
    AND EXISTS (
      SELECT 1
      FROM public.drives d
      WHERE d.id = drive_college_approvals.drive_id
        AND d.company_user_id = auth.uid()
    )
  );

-- Applications (student -> company)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  drive_id UUID NOT NULL REFERENCES public.drives(id) ON DELETE CASCADE,
  student_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_college_name TEXT NOT NULL,
  status public.application_status NOT NULL DEFAULT 'applied',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (drive_id, student_user_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Students can insert applications only for accepted drives of their college
DROP POLICY IF EXISTS "Students can insert applications" ON public.applications;
CREATE POLICY "Students can insert applications"
  ON public.applications
  FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'student')
    AND student_user_id = auth.uid()
    AND student_college_name = (
      SELECT p.college_name
      FROM public.profiles p
      WHERE p.user_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1
      FROM public.drive_college_approvals a
      WHERE a.drive_id = drive_id
        AND a.status = 'accepted'
        AND a.college_name = student_college_name
    )
  );

-- Students can view their own applications
DROP POLICY IF EXISTS "Students can view own applications" ON public.applications;
CREATE POLICY "Students can view own applications"
  ON public.applications
  FOR SELECT
  USING (
    student_user_id = auth.uid()
  );

-- Companies can view applications for their drives
DROP POLICY IF EXISTS "Companies can view applications for own drives" ON public.applications;
CREATE POLICY "Companies can view applications for own drives"
  ON public.applications
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'company')
    AND EXISTS (
      SELECT 1
      FROM public.drives d
      WHERE d.id = drive_id
        AND d.company_user_id = auth.uid()
    )
  );

-- Companies can update application status (selected/rejected)
DROP POLICY IF EXISTS "Companies can update application status" ON public.applications;
CREATE POLICY "Companies can update application status"
  ON public.applications
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'company')
    AND EXISTS (
      SELECT 1
      FROM public.drives d
      WHERE d.id = drive_id
        AND d.company_user_id = auth.uid()
    )
  )
  WITH CHECK (
    status IN ('selected', 'rejected')
    AND public.has_role(auth.uid(), 'company')
    AND EXISTS (
      SELECT 1
      FROM public.drives d
      WHERE d.id = drive_id
        AND d.company_user_id = auth.uid()
    )
  );

