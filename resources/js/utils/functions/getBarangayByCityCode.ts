import barangays from "../data/barangays";

const getBarangayByCityCode = (cityCode: number) => {
    return barangays?.filter((item: any) => parseInt(item?.city_code) == cityCode);
}

export default getBarangayByCityCode