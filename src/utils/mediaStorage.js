import { v2 as cloudinary } from 'cloudinary'
import {CloudinaryStorage} from 'multer-storage-cloudinary'

export const mediaStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "WhatsApp_BuildWeek"
    }
})