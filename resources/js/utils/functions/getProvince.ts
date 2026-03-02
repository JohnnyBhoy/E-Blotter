import provinces from "../data/provinces";

const getProvince = (code: string | number) => {
    console.log('Province input code:', code, 'Type:', typeof code);
    
    // Convert to string and pad with leading zeros to 4 digits
    const codeString = code.toString().padStart(4, '0');
    console.log('Province processed code string:', codeString);
    
    const result = provinces?.filter((item: any) => item?.province_code === codeString);
    console.log('Province filter result:', result);
    console.log('Province name:', result[0]?.province_name);
    
    return result[0]?.province_name;
}

export default getProvince;