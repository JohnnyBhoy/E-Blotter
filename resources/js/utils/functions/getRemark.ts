import barangays from "../data/barangays";
import disposition from "../data/disposition";

const getRemark = (id: number) => {
    const result = disposition?.filter((item: any) => parseInt(item?.id) == id);
    return result[0]?.value;
}

export default getRemark;