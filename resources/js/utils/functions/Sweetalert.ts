import Swal, { SweetAlertIcon } from "sweetalert2";

const SweetAlert = (title: string, text: string, icon: SweetAlertIcon | undefined, timer: number) => {
    return Swal.fire({
        position: "top-end",
        title: title,
        icon: icon,
        timer: timer,
        showConfirmButton: false,
    })
};

export default SweetAlert