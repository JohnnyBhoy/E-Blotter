import { AreaCount, ConsoleLevel, ConsoleScope } from "@/Components/Barangay/Dashboard/types";
import getBarangayByBrgyCode from "./getBarangayByBrgyCode";
import getCity from "./getCity";
import getProvince from "./getProvince";
import getRegion from "./getRegion";

/**
 * Names for the console's area breakdown, whatever level the viewer is at.
 *
 * The server only knows PSGC codes -- the names live in utils/data -- and a
 * barangay's areas are puroks, which are free text and carry no code at all.
 */

/** The lookup that names one unit below each level. */
const NAME_BY_LEVEL: Record<ConsoleLevel, (code: number) => string | undefined> = {
    national: getRegion,
    region: getProvince,
    province: getCity,
    station: getBarangayByBrgyCode,
    // A barangay breaks down by purok, which arrives already named.
    barangay: () => undefined,
};

/**
 * Label for one row of the area breakdown. Falls back to the bare code so an
 * area missing from the PSGC lookups still shows something identifiable.
 */
export const getAreaName = (level: ConsoleLevel, row: AreaCount): string => {
    if (row.name) {
        return row.name;
    }

    return NAME_BY_LEVEL[level](row.code) ?? (row.code ? `Code ${row.code}` : "Unspecified");
};

/**
 * The jurisdiction itself, for the console header and greeting: "Barangay Bayo
 * Grande", "Anini-y", "Antique", "Region VI (Western Visayas)", "Nationwide".
 */
export const getJurisdictionName = (scope: ConsoleScope): string => {
    switch (scope.level) {
        case "barangay":
            return `Barangay ${getBarangayByBrgyCode(scope.barangayCode) ?? ""}`.trim();
        case "station":
            return getCity(scope.cityCode) ?? "Your municipality";
        case "province":
            return getProvince(scope.provinceCode) ?? "Your province";
        case "region":
            return getRegion(scope.regionCode) ?? "Your region";
        default:
            return "Nationwide";
    }
};

/** The value the area filter sends: a purok name, or a PSGC code above barangay level. */
export const areaFilterValue = (level: ConsoleLevel, row: AreaCount): string =>
    level === "barangay" ? String(row.name ?? "") : String(row.code);

export default getAreaName;
