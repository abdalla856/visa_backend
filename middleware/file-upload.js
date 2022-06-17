import multer from 'multer'
import {v4 as uuid} from 'uuid'
const MIME_YPE_MAP ={
    'image/png' :'png',
    'image/jpeg' :'jpeg',
    'image/jpg' :'jpg',
    'application/pdf' :'pdf'
}
export const fileUplaod =multer ({
    limit :50000000,
    storage :multer.diskStorage({
        destination :(req,file,cb)=>{
            console.log('hi')
            cb(null , 'uploads/files')
        } ,
        filename:(req,file,cb)=>{
            const id = uuid()
            const ext = MIME_YPE_MAP[file.mimetype]
            cb(null ,id +'.'+ext )
        }
    
    }),
    fileFilter :(req,file,cb) =>{
        const isValid = !!MIME_YPE_MAP[file.mimetype]
        let error = isValid ?null : new Error('Invalid mmimetype!')
        cb(error ,isValid);

    }

})


export const potoUplaod =multer ({
    limit :50000000,
    storage :multer.diskStorage({
        destination :(req,file,cb)=>{
            console.log('hi')
            cb(null , 'uploads/photos')
        } ,
        filename:(req,file,cb)=>{
            const id = uuid()
            const ext = MIME_YPE_MAP[file.mimetype]
            cb(null ,id +'.'+ext )
        }
    
    }),
    fileFilter :(req,file,cb) =>{
        const isValid = !!MIME_YPE_MAP[file.mimetype]
        let error = isValid ?null : new Error('Invalid mmimetype!')
        cb(error ,isValid);

    }

})



