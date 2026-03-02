import cities from "../data/cities";

const getCity = (code: string | number) => {
    // Convert to string and pad with leading zeros to 6 digits
    const codeString = code.toString().padStart(6, "0");

    const result = cities?.filter(
        (item: any) => item?.city_code === codeString,
    );

    return result[0]?.city_name;
};

export default getCity;
