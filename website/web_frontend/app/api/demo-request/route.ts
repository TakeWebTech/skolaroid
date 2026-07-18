import { NextResponse } from 'next/server';
import { createErpNextLead } from '@/lib/erpnext';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createErpNextLead({
      lead_name: body.full_name || body.school_name || 'Website demo request',
      company_name: body.school_name,
      email_id: body.work_email,
      mobile_no: body.phone,
      city: body.city,
      state: body.state,
      country: body.country,
      source: 'Website',
      status: 'Lead',
      custom_school_type: body.school_type,
      custom_student_count: body.student_count,
      custom_branch_count: body.branch_count,
      custom_modules_of_interest: Array.isArray(body.modules_of_interest) ? body.modules_of_interest.join(', ') : '',
      custom_current_software: body.current_software,
      custom_timeline: body.timeline,
      custom_preferred_demo_date: body.preferred_date,
      custom_preferred_demo_time: body.preferred_time,
      custom_meeting_type: body.meeting_type,
      notes: [
        body.challenges && `Challenges: ${body.challenges}`,
        body.additional_requirements && `Additional requirements: ${body.additional_requirements}`,
        body.source_page && `Source page: ${body.source_page}`,
        body.campaign && `Campaign: ${body.campaign}`,
      ].filter(Boolean).join('\n'),
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Could not submit demo request' }, { status: 500 });
  }
}
