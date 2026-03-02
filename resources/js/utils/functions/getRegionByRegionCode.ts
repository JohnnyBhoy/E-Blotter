import regions from "../data/regions";

const getRegionByRegionCode = (code: string | number) => {
    console.log('Input code:', code, 'Type:', typeof code);
    
    // Convert to string and pad with leading zero if needed
    const codeString = code.toString().padStart(2, '0');
    console.log('Processed code string:', codeString);
    
    const result = regions?.filter((item: any) => item?.region_code === codeString);
    console.log('Filter result:', result);
    console.log('Region name:', result[0]?.region_name);
    
    return result[0]?.region_name;
}

export default getRegionByRegionCode;
