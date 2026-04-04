'use client'

import { UploadButton } from '@/utils/uploadthing/uploadthing';
import { toast } from 'sonner';

export function RecipePhotoUploader({ test }: { test?: boolean }) {

    return (
        test ? (
            <button onClick={() => toast.info('Currently unavailable')} className='text-blue-400 cursor-pointer hover:text-blue-200'>Test Upload</button>
        ) : (
            <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    alert("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                }}
            />
        )

    );
}