export const getResponders = (res: number) => {
    if(res == 1) return 'Team A';
    if(res == 2) return 'Team B';
    if(res == 3) return 'Team C';
    if(res == 4) return 'Team D';

    return 'In progress';
}