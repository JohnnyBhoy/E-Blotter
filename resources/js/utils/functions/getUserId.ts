import { PageProps } from "@/Pages/types";
import { usePage } from "@inertiajs/react";

const getUserId = () => {
    return usePage<PageProps>().props.auth.user?.id;
}

export default getUserId