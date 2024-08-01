import provinces from "../data/provinces";

const getProvince = (code: number) => {
    const result = provinces?.filter((item: any) => parseInt(item?.province_code) == code);
    return result[0]?.province_name;
}

export default getProvince;