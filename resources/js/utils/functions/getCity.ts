import cities from "../data/cities";

const getCity = (code: number) => {
    const result = cities?.filter((item: any) => parseInt(item?.city_code) == code);
    return result[0]?.city_name;
}

export default getCity;