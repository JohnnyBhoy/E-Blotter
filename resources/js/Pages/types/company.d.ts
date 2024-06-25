export type ListResultCompanyDetailsProps = {
    rating: number,
    item: {
        id: number,
        created_at: string,
        user_avatar: string,
        company_name: string,
        email_verified_at: string,
        provided_marketing_material: string | null,
        provided_crm: string | null,
        provided_training: string | null,
        company_city: string | null,
        company_state: string | null,
        country: string | null,
        first_name: string,
        last_name: string,
        account_type: string,
        agency_type: string | null

    },
    handleCreateFavorite: CallableFunction,
    setIsGuest: CallableFunction,
}