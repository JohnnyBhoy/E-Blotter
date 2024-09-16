import getUserId from '@/utils/functions/getUserId';
import React, { useState } from 'react';
import Editor from 'react-simple-wysiwyg';
import Swal from 'sweetalert2';

type Data = {
    id: number;
    value: string;
}

const Narrative = ({ data, setData }: { data: any; setData: CallableFunction }) => {
    const [errorUpload, setErrorUpload] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [headshot, setHeadshot] = useState<string>('');

    const userId = getUserId();

    function onChange(e: any) {
        setData('narrative', e.target.value);
    }

    // Image / Headshot handler
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.files && e.target.files[0]) {
            const headshotFile = e.target.files[0];
            const obj = URL.createObjectURL(headshotFile);

            const fileType = headshotFile.name.split(".")[headshotFile.name.split(".").length - 1];
            const fileSize = headshotFile.size;
            const supportedFileType = ['jpg', 'jpeg', 'png', 'jfif', 'mp4'];

            // Return if unsupported image format
            if (supportedFileType.indexOf(fileType) == -1) {
                return Swal.fire({
                    title: "Unsupported Image Fomat",
                    text: "Allowed format ('jpg', 'jpeg', 'png', 'jfif', 'mp4')",
                    icon: 'error',
                    timer: 3000,
                    showConfirmButton: false,
                    showCancelButton: false,
                });
            };

            // Return if file is too big or more than 1mb
            if (fileSize > 10000000) {
                return Swal.fire({
                    title: "File too large",
                    text: "Allowed size 10mb",
                    icon: 'error',
                    timer: 3500,
                    showConfirmButton: false,
                    showCancelButton: false,
                });
            };

            setErrorUpload('');
            setImage(headshotFile);
            setData('uploaded_file', headshotFile);
            setHeadshot(obj);
        }
    };

    // Confirm change uploaded video or image
    const handleConfirmChange = () => {
        return Swal.fire({
            title: "Are you sure?",
            text: 'You are about to change uploaded image',
            icon: 'warning',
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                setHeadshot("");
                setData('uploaded_file', "");
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        })
    }

    return (

        <div className="animate-fadeinup rounded-lg border border-stroke dark:border-strokedark dark:bg-boxdark mt-4">

            <div className="lg:flex gap-6 w-full">
                <div className="bg-white lg:w-[60%] w-full">
                    <div className="flex justify-between border-b border-stroke py-2 px-6.5 dark:border-strokedark  dark:bg-boxdark bg-white">
                        <h3 className="font-medium dark:text-white">
                            Narrative of Incident
                        </h3>
                    </div>
                    <Editor
                        value={data.narrative}
                        onChange={onChange}
                        className='h-28 text-sm'
                        containerProps={{ style: { resize: 'vertical', height: '20rem', overflow: 'auto' } }}
                    />
                    {/** End complainant Address */}
                </div>

                <div className="lg:w-[40%] bg-white">
                    <div className="flex justify-between border-b border-stroke py-2 px-6.5 dark:border-strokedark  dark:bg-boxdark bg-white">
                        <h3 className="font-medium dark:text-white">
                            Upload Picture / Video
                        </h3>

                        {headshot != "" ? (
                            <button
                                className="font-medium text-black dark:text-white bg-white dark:bg-boxdark border hover:bg-slate-300 text-xs rounded-3xl px-3 text-blue-700"
                                onClick={handleConfirmChange}
                            >
                                Change
                            </button>
                        ) : null}
                    </div>

                    <div className="flex justify-center place-items-center">
                        {headshot != "" ? (
                            <img
                                src={headshot != "" ? headshot : ""}
                                alt="incident-icon"
                                className='lg:mt-[1rem] mt-[1rem] lg:h-[18rem] h-[10rem] lg:w-[28rem] w-[10rem] border shadow'
                            />
                        ) : data?.uploaded_file != "" ? (
                            <img
                                src={`/images/${userId}/incidents/${data?.uploaded_file}`}
                                alt="incident-icon"
                                className='lg:mt-[1rem] mt-[1rem] lg:h-[18rem] h-[10rem] lg:w-[28rem] w-[10rem] border shadow'
                            />
                        ) : (
                            <input
                                type="file"
                                className='mt-[10rem] ml-[5rem]'
                                onChange={(e) => handleImageChange(e)}
                            />
                        )
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Narrative