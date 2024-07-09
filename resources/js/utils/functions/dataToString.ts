const dateToString = (createdAt: any) => {
        if (!createdAt) {
                return 'Not Specified';
        }

        let dateString = createdAt?.toString();

        dateString = dateString?.substr(0, 10);

        const [year, day, month] = dateString?.split('-');

        dateString = new Date(+year, +day - 1, +month);
        dateString = dateString?.toString().slice(3, 15)

        return dateString;
}

export default dateToString;