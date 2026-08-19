import getIncidentType from "./getIncidentType";

/**
 * The statute citation of an incident type without its quoted title, e.g.
 * "RPC, Art 154". The full labels run to 100+ characters and do not fit a chart
 * legend or a table cell.
 *
 * @param id incident_type ID, see utils/data/incidentTypes.ts
 */
const getIncidentTypeShort = (id: number): string => {
    const label = getIncidentType(id);

    if (!label) {
        return "Others";
    }

    // Labels are "<citation> - <quoted title>"; the title is the part we drop.
    const [citation] = label.split(" - ");

    return (citation ?? label).trim();
};

export default getIncidentTypeShort;
