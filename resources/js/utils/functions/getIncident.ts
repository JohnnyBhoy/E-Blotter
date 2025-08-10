export const getIncident = (incident: number) => {
    if(incident == 1) return '👮CRIME';
    if(incident == 2) return '🚒FIRE';
    if(incident == 3) return '🏥MEDICAL';
    if(incident == 4) return '🌪️DISASTER';

    return 'In progress';
}