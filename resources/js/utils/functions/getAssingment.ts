export const getAssignment = (id: number) => {
    if(id == 1) return 'PNP RESPONSE TEAM';
    if(id == 2) return 'BFP RESPONSE TEAM';
    if(id == 3) return 'MEDICAL RESCUE TEAM';
    if(id == 4) return 'DISASTER RECUE TEAM';

    return 'In progress';
}