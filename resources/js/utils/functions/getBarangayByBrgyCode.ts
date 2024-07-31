import barangays from "../data/barangays";

const getBarangayByBrgyCode = (brgyCode: number) => {
    const result = barangays?.filter((item: any) => parseInt(item?.brgy_code) == brgyCode);
    return result[0]?.brgy_name;
}

export default getBarangayByBrgyCode;