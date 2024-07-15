import React from 'react'
import { Hypnotize } from 'react-bootstrap-icons'

const SubmitRegistration = ({ processing }: { processing: boolean }) => {
    return (
        < div className="mb-5">
            <button
                className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
            >
                {!processing
                    ? 'Create account'
                    : <p className='flex gap-2 justify-center'>
                        Signing Up... <Hypnotize className='animate-spin' size={24} />
                    </p>
                }
            </button>
        </div>
    )
}

export default SubmitRegistration