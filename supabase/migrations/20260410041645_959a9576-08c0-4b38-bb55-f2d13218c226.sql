
-- Drives table
CREATE TABLE public.drives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  package TEXT NOT NULL,
  vacancies INTEGER NOT NULL DEFAULT 0,
  visit_date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.drives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view drives" ON public.drives FOR SELECT TO authenticated USING (true);
CREATE POLICY "Companies can insert their own drives" ON public.drives FOR INSERT TO authenticated WITH CHECK (auth.uid() = company_user_id);
CREATE POLICY "Companies can update their own drives" ON public.drives FOR UPDATE TO authenticated USING (auth.uid() = company_user_id);
CREATE POLICY "Companies can delete their own drives" ON public.drives FOR DELETE TO authenticated USING (auth.uid() = company_user_id);

-- Drive college approvals table
CREATE TABLE public.drive_college_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  drive_id UUID NOT NULL REFERENCES public.drives(id) ON DELETE CASCADE,
  college_user_id UUID NOT NULL,
  college_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (drive_id, college_user_id)
);

ALTER TABLE public.drive_college_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "College users can view their own approvals" ON public.drive_college_approvals FOR SELECT TO authenticated USING (auth.uid() = college_user_id);
CREATE POLICY "College users can insert approvals" ON public.drive_college_approvals FOR INSERT TO authenticated WITH CHECK (auth.uid() = college_user_id);
CREATE POLICY "College users can update their approvals" ON public.drive_college_approvals FOR UPDATE TO authenticated USING (auth.uid() = college_user_id);

-- Applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  drive_id UUID NOT NULL REFERENCES public.drives(id) ON DELETE CASCADE,
  student_user_id UUID NOT NULL,
  student_name TEXT,
  college_name TEXT,
  status TEXT NOT NULL DEFAULT 'applied',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (drive_id, student_user_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own applications" ON public.applications FOR SELECT TO authenticated USING (auth.uid() = student_user_id);
CREATE POLICY "Students can insert their own applications" ON public.applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_user_id);
CREATE POLICY "Companies can view applications for their drives" ON public.applications FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.drives WHERE drives.id = applications.drive_id AND drives.company_user_id = auth.uid())
);
