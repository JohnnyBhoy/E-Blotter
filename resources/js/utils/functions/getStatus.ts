export const getStatus = (status: number) => {
    if(status == 1) return '🔄In progress';
    if(status == 2) return '🔛On the way';
    if(status == 3) return '🏴󠁳󠁬󠁷󠁿Arrived at Area';
    if(status == 4) return '☑️Resolved';

    return 'In progress';
}