import regions from "../data/regions";

/**
 * Region name for a PSGC region code. Codes are stored as integers in the
 * database, so the leading zero of "06" is gone by the time it gets here --
 * compare the lookup as an integer too.
 */
const getRegion = (code: number) => {
    const result = regions?.filter((item: any) => parseInt(item?.region_code) == code);
    return result[0]?.region_name;
};

export default getRegion;
