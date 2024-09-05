import { create } from "zustand";

// Dates
const date = new Date();
const todayYear = date.getFullYear();
const todayMonth = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
const todayDay = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

type OnlineComplaint = {
    incident_type: string,
    date_reported: string,
    time_reported: string,
    date_of_incident: string,
    time_of_incident: string,
    purok: string,
    barangay: string,
    city: string,
    province: string,
    landmark_location: string,
    family_name: string,
    first_name: string,
    middle_name: string,
    age: number,
    contact_number: number,
    relationship_to_the_incident: string,
    reporter_purok: string,
    reporter_barangay: string,
    reporter_city: string,
    reporter_province: string,
    reporter_zip_code: number,
    narrative_of_incident: string,
    number_of_people_involved: number,
    perpetrator_details: string,
    victim_details: string,
}

type OnlineComplaintStore = {
    onlineComplaintData: OnlineComplaint,
    showOnlineComplaintModal: boolean,
    setShowOnlineComplaintModal: (showOnlineComplaintModal: boolean) => void,
    setOnlineComplaintData: (onlineComplaintData: OnlineComplaint) => void,
}

export const useOnlineComplaintStore = create<OnlineComplaintStore>((set) => ({
    onlineComplaintData: {
        incident_type: "",
        date_reported: `${todayYear}-${todayMonth}-${todayDay}`,
        time_reported: `${h}:${m}`,
        date_of_incident: `${todayYear}-${todayMonth}-${todayDay}`,
        time_of_incident: `${h}:${m}`,
        purok: "",
        barangay: "",
        city: "",
        province: "",
        landmark_location: "",
        family_name: "",
        first_name: "",
        middle_name: "",
        age: 0,
        contact_number: 0,
        relationship_to_the_incident: "",
        reporter_purok: "",
        reporter_barangay: "",
        reporter_city: "",
        reporter_province: "",
        reporter_zip_code: 0,
        narrative_of_incident: "",
        number_of_people_involved: 0,
        perpetrator_details: "",
        victim_details: "",
    },
    showOnlineComplaintModal: false,
    setOnlineComplaintData: (onlineComplaintData: OnlineComplaint) => set(() => ({ onlineComplaintData: onlineComplaintData })),
    setShowOnlineComplaintModal: (showOnlineComplaintModal: boolean) => set(() => ({ showOnlineComplaintModal: showOnlineComplaintModal })),
}))
