<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComplaintRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [

            /*----------------------------------------------------
            | SECTION 1 — Main Complaint (Required)
            ----------------------------------------------------*/
            // 'relation_with_person'        => 'nullable|string|max:500',
            // 'authorization_document'      => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',

            // Permanent Address
            // 'permanent_name'              => 'nullable|string|max:255',
            // 'permanent_place'             => 'nullable|string|max:255',
            // 'permanent_post_office'       => 'nullable|string|max:255',
            // 'permanent_district'          => 'nullable|string|max:255',

            // Correspondence Address
            'correspondence_name'         => 'nullable|string|max:255',
            'correspondence_place'        => 'nullable|string|max:255',
            'correspondence_post_office'  => 'nullable|string|max:255',
            'correspondence_district'     => 'nullable',


            /*----------------------------------------------------
            | SECTION 6
            ----------------------------------------------------*/
            'cause_date'                  => 'nullable|date',
            'delay_reason'                => 'nullable|string',

            'previously_submitted'        => 'nullable|in:yes,no',
            'previously_submitted_details'=> 'required_if:previously_submitted,yes',


            /*----------------------------------------------------
            | SECTION 7
            ----------------------------------------------------*/
            // 'category'                    => 'in:assertion,complaint',


            /*----------------------------------------------------
            | SECTION 8 — Challan (Required)
            ----------------------------------------------------*/
            // 'challan_number'              => 'nullable|string|max:255',
            'challan_number' => ['nullable', 'regex:/^[A-Za-z0-9\- ]+$/', 'max:255'],
            'challan_date'                => 'nullable|date',
            'challan_file'                => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',


            /*----------------------------------------------------
            | SECTION 9–12
            ----------------------------------------------------*/
            // 'support_name'   => 'nullable|string',
            // 'support_address'   => 'nullable|string',
            // 'witness_name'             => 'nullable|string',
            // 'witness_address'             => 'nullable|string|250',
            'attached_documents_description'          => 'nullable|string|max:1500',
            'attached_documents'          => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'complaint_description'       => 'nullable|string',


            /*----------------------------------------------------
            | MULTIPLE COMPLAINANTS (Required)
            ----------------------------------------------------*/

            

            'permanent_place'             => 'nullable|array',
            'permanent_place.*'   => 'nullable|string|max:255',
            
            'permanent_post_office'       => 'nullable|array',
            'permanent_post_office.*'   => 'nullable|string|max:255',
           
            'permanent_district'          => 'nullable|array',
            'permanent_district.*'   => 'nullable',
           
            'support_name'   => 'nullable|array|min:1',
             'support_name.*'   => 'nullable|string|max:150',
          
             'support_address'   => 'nullable|array|min:1',
             'support_address.*'   => 'nullable|string|max:255',

            'witness_name'             => 'nullable|array|min:1',
             'witness_name.*'          => 'nullable|string|max:150',
            
            'witness_address'             => 'nullable|array|min:1',
            'witness_address.*'          => 'nullable|string|max:255',

            'complainant_name'            => 'nullable|array',
            'complainant_name.*'          => 'nullable|string|max:255',

            'father_name'                 => 'nullable|array',
            'father_name.*'               => 'nullable|string|max:255',

            'occupation'                  => 'nullable|array',
            'occupation.*'                => 'nullable|string|max:255',

            'is_public_servant'           => 'nullable|array|min:1',
            'is_public_servant.*'         => 'nullable|in:yes,no',

        //  'is_main_c'   => 'nullable|array|min:1',
        // 'is_main_c.0' => 'present|in:1',

             'is_main_c' => [
                    'required',
                    'array',
                    function ($attribute, $value, $fail) {
                        if (!in_array(1, $value)) {
                            $fail('Main value complainant required.');
                        }
                    }
                ],
            //  'is_main_r' => [
            //         'required',
            //         'array',
            //         function ($attribute, $value, $fail) {
            //             if (!in_array(1, $value)) {
            //                 $fail('Main value respondant required.');
            //             }
            //         }
            //     ],
            

        // 'is_main_r'   => 'nullable|array|min:1',
        // 'is_main_r.0' => 'present|in:1',


            /*----------------------------------------------------
            | MULTIPLE RESPONDENTS (Required)
            ----------------------------------------------------*/
            'respondent_name'             => 'nullable|array|min:1',
            'respondent_name.*'           => 'nullable|string|max:150',
           
            'officer_category'             => 'nullable|array|min:1',
            'officer_category.*'           => 'nullable|string|max:150',
        
            'respondent_district'             => 'nullable|array|min:1',
            'respondent_district.*'           => 'nullable',

            'designation'                 => 'nullable|array|min:1',
            'designation.*'               => 'nullable|string|max:255',

            'current_address'             => 'nullable|array|min:1',
            'current_address.*'           => 'nullable|string',
        ];
    }



    public function messages()
    {
        return [

            /* -----------------------------------------
            | Main Complaint
            ----------------------------------------- */
            'relation_with_person.required' => 'Relation with person is required.',
            'authorization_document.required' => 'Authorization document is required.',
            'authorization_document.mimes' => 'Authorization document must be a PDF or image.',
            'authorization_document.max' => 'Authorization document size cannot exceed 2MB.',

            // 'permanent_name.required' => 'Permanent address name is required.',
           

            'correspondence_name.required' => 'Correspondence name is required.',
            'correspondence_place.required' => 'Correspondence place is required.',
            'correspondence_post_office.required' => 'Correspondence post office is required.',
            'correspondence_district.required' => 'Correspondence district is required.',


            /* -----------------------------------------
            | Section 6
            ----------------------------------------- */
            'cause_date.required' => 'Cause date is required.',
            'delay_reason.required' => 'Delay reason is required.',
            'previously_submitted.required' => 'Please select Yes/No.',
            'previously_submitted_details.required_if' => 'Details required if previously submitted.',


            /* -----------------------------------------
            | Section 7
            ----------------------------------------- */
            'category.required' => 'Category is required.',
            'category.in' => 'Category must be assertion or complaint.',


            /* -----------------------------------------
            | Challan
            ----------------------------------------- */
            // 'challan_number.required' => 'Challan number is required.',
            // 'challan_date.required' => 'Challan date is required.',
            // 'challan_file.required' => 'Challan file is required.',
             'challan_number.regex' => 'The challan number may only contain letters, numbers, spaces, and dashes (-).',
            'challan_number.max'   => 'The challan number must not exceed 255 characters.',
            'challan_file.mimes' => 'Challan file must be a PDF or image.',
            'challan_file.max' => 'Challan file size cannot exceed 2MB.',


            /* -----------------------------------------
            | Section 9–12
            ----------------------------------------- */
            'supporting_affidavit_list.required' => 'Supporting affidavit list required.',
            'other_witnesses.required' => 'Other witnesses detail required.',
            'attached_documents_description.required' => 'Attached documents Description detail required.',
            'attached_documents.required' => 'Attached documents detail required.',
            'complaint_description.required' => 'Complaint description is required.',


            /* -----------------------------------------
            | Complainants
            ----------------------------------------- */
            'complainant_name.required' => 'At least one complainant is required.',
            'complainant_name.*.required' => 'Complainant name is required.',

            'father_name.*.required' => 'Father name is required.',
            'occupation.*.required' => 'Occupation is required.',
            'is_public_servant.*.required' => 'Public servant Yes/No is required.',


             'permanent_place.required' => 'At least one Place is required.',
             'permanent_place.*.required' => 'Place is required.',
            
             'permanent_post_office.required' => 'At least one Post office is required.',
             'permanent_post_office.*.required' => 'Post office is required.',
            
             'permanent_district.required' => 'At least one District is required.',
            'permanent_district.*.required' => 'District is required.',
            
            'support_name.required' => 'At least one Support person name is required.',
            'support_name.*.required' => 'Support person name is required.',
        
            'support_address.required' => 'At least one Support person address is required.',
            'support_address.*.required' => 'Support person address is required.',
        
            'witness_name.required' => 'At least one Witness is required.',
            'witness_name.*.required' => 'Witness  is required.',
        
            'witness_address.required' => 'At least one Witness address is required.',
            'witness_address.*.required' => 'Witness address is required.',

            // 'is_main_c.0.in' => 'First complainant must be marked as Main (value must be 1).',
            // 'is_main_r.0.in' => 'First respondent must be marked as Main (value must be 1).',
        
             'is_main_c.required' => 'Checked atleast one checkbox main.',
             'is_main_c.array' => 'Main value reuires.',
          
             'is_main_r.required' => 'Checked atleast one checkbox main.',
             'is_main_r.array' => 'Main value reuires.',


            /* -----------------------------------------
            | Respondents
            ----------------------------------------- */
            'respondent_name.required' => 'At least one respondent is required.',
            'respondent_name.*.required' => 'Respondent name is required.',

            'designation.*.required' => 'Respondent designation is required.',
            'current_address.*.required' => 'Current address is required.',
        ];
    }
}
