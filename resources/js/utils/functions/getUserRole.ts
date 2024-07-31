import { PageProps } from "@/Pages/types";
import { usePage } from "@inertiajs/react";

const getUserRole = () => {
    return usePage<PageProps>().props.auth.user?.role;
}

export default getUserRole