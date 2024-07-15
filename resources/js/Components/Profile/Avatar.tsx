import { PageProps } from '@/Pages/types';
import { useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react'
import { Camera, Hypnotize, SaveFill } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';

const Avatar = () => {
    const userAvatar = usePage<PageProps>().props.auth.user?.avatar;
    const userSix = userAvatar ? `/images/barangay_avatar/${userAvatar}` : './images/user/admin_2.png';

    const [errorUpload, setErrorUpload] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [headshot, setHeadshot] = useState<string>('');

    const { data, setData, post, processing } = useForm({
        avatar: image,
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
            setData('avatar', headshotFile);
            setHeadshot(obj);
        }
    };

    const submit = (e: any) => {
        e.preventDefault()
        Swal.fire({
            title: "Save changes to Profile Avatar?",
            showCancelButton: true,
            showConfirmButton: true,
        }).then((result) => {
            if (result.isConfirmed) {

                post('/profile');

                setTimeout(() => {
                    Swal.fire({
                        title: "Changes saved!",
                        text: "Your profile pic has been change.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2500,
                    });
                }, 2000);
            }
        });
    }

    return (
        <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
                <img src={headshot != "" ? headshot : userSix} alt="profile" className='rounded-full' />
                <form onSubmit={submit}>
                    <label
                        htmlFor="profile"
                        className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                    >
                        <input
                            type="file"
                            name="profile"
                            id="profile"
                            className="sr-only rounded-full"
                            onChange={(e) => handleImageChange(e)}
                        />

                        {image
                            ? <button className='flex gap-1' type="submit">
                                {processing ? <Hypnotize className='animate-spin ' size={12} /> : <SaveFill className='m-1' />}
                            </button>
                            : <span> <Camera /> </span>
                        }
                    </label>
                </form>
            </div>
        </div>
    )
}

export default Avatar