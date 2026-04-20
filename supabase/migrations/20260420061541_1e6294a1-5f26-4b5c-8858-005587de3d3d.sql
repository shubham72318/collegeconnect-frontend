CREATE POLICY "Companies can update applications for their drives"
ON public.applications
FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.drives d WHERE d.id = applications.drive_id AND d.company_user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.drives d WHERE d.id = applications.drive_id AND d.company_user_id = auth.uid()));