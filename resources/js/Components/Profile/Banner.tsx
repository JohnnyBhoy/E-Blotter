import { PageProps } from '@/Pages/types';
import { useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { Camera, SaveFill } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';

const Banner = () => {
    const userBanner = usePage<PageProps>().props.auth.user?.banner;
    const CoverOne = userBanner ? `/images/barangay_banner/${userBanner}` : './images/cover/cover-01.png';

    const [errorUpload, setErrorUpload] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [headshot, setHeadshot] = useState<string>('');

    const { data, setData, post, processing } = useForm({
        banner: image,
    });

    // Image / Headshot handler
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.files && e.target.files[0]) {
            const headshotFile = e.target.files[0];
            const obj = URL.createObjectURL(headshotFile);

            const fileType = headshotFile.name.split(".")[headshotFile.name.split(".").length - 1];
            const fileSize = headshotFile.size;
            const supportedFileType = ['jpg', 'jpeg', 'png', 'jfif'];

            // Return if unsupported image format
            if (supportedFileType.indexOf(fileType) == -1) {
                return Swal.fire({
                    title: "Unsupported Image Fomat",
                    text: "Allowed format ('jpg', 'jpeg', 'png', 'jfif')",
                    icon: 'error',
                    timer: 3000,
                    showConfirmButton: false,
                    showCancelButton: false,
                });
            };

            // Return if file is too big or more than 1mb
            if (fileSize > 1000000) {
                setErrorUpload('Your selected file size is not supported');
                return;
            };

            setErrorUpload('');
            setImage(headshotFile);
            setData('banner', headshotFile);
            setHeadshot(obj);
        }
    };

    const submit = (e: any) => {
        e.preventDefault()
        Swal.fire({
            title: "Save changes to Profile Banner?",
            showCancelButton: true,
            showConfirmButton: true,
        }).then((result) => {
            if (result.isConfirmed) {

                post('/profile');

                setTimeout(() => {
                    Swal.fire({
                        title: "Changes saved!",
                        text: "Your banner has been changes.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2500,
                    });
                }, 2000);
            }
        });
    }

    return (
        <div className="relative z-20 h-35 md:h-65">

            <img
                src={headshot != "" ? headshot : CoverOne}
                alt="profile cover"
                className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
            />

            <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
                <form onSubmit={submit}>
                    <label
                        htmlFor="cover"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-90 xsm:px-4"
                    >

                        <input
                            type="file"
                            name="cover"
                            id="cover"
                            className="sr-only"
                            onChange={(e) => handleImageChange(e)}
                        />


                        {image
                            ? <button className='flex gap-1' type="submit">
                                <SaveFill className='m-1' /> {processing ? 'Saving...' : 'Save'}
                            </button>
                            : <>
                                <span>
                                    <Camera />
                                </span>
                                <span>Edit</span>
                            </>}
                    </label>
                </form>
            </div>
        </div>
    )
}

export default Banner