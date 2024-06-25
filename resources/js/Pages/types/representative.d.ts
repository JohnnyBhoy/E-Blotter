
export type Representative = {
    data: {
        user_account_id: number;
        first_name: string;
        last_name: string;
        company_name: string;
        company_website: string | undefined;
        email_address: string;
        phone_number: string | undefined;
        direct_phone_number: string | undefined;
        agency_size: string | undefined;
        upfront_fee: string | undefined;
        extension: string | undefined;
        rep_address: string | undefined;
        rep_address_2: string | undefined;
        rep_city: string | undefined;
        rep_state: string | undefined;
        country: string | undefined;
        rep_zip: string | undefined;
        facebook: string | undefined;
        twitter: string | undefined;
        linkedin: string | undefined;
        github: string | undefined;
        whatsapp: string | undefined;
        portfolio: string | undefined;
        user_avatar: string;
        agency_type: string;
        years_of_experience: string;
        warehouse_offered: string;
        password: string;
        education_level: string;
        target_industries: string;
        //targetProspects: string;
        current_products_sold: string;
        value_proposition: string;
        territories: string;
        compensation_model: number;
        headline: string;
        updatedAt: string | undefined;
        createdAt: string | undefined;
    }
}