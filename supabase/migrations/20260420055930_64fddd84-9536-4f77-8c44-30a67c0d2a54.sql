CREATE POLICY "Students can view approvals for their college"
ON public.drive_college_approvals
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role = 'student'
      AND p.college_name = drive_college_approvals.college_name
  )
);

CREATE POLICY "Companies can view approvals for their drives"
ON public.drive_college_approvals
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.drives d
    WHERE d.id = drive_college_approvals.drive_id
      AND d.company_user_id = auth.uid()
  )
);