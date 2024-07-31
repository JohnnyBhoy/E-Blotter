import incidentTypes from "../data/incidentTypes"

const getIncidentType = (id: number) => {

    const result: any = incidentTypes?.filter((item: any) => item?.id == id);
    return result[0]?.value ?? 'Others';

}

export default getIncidentType