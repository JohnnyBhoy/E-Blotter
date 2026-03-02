import barangays from "../data/barangays";

const getBarangayByBrgyCode = (brgyCode: string | number) => {
    console.log('Barangay input code:', brgyCode, 'Type:', typeof brgyCode);
    
    // Convert to string and pad with leading zeros to 9 digits
    const codeString = brgyCode.toString().padStart(9, '0');
    console.log('Barangay processed code string:', codeString);
    
    const result = barangays?.filter((item: any) => item?.brgy_code === codeString);
    console.log('Barangay filter result:', result);
    console.log('Barangay name:', result[0]?.brgy_name);
    
    return result[0]?.brgy_name;
}

export default getBarangayByBrgyCode;