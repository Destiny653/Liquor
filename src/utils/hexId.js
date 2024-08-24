import {objectId} from 'mongodb';

export function to24CharHexString(str){
    str = str.replace(/[^0-9a-fA-F]/g, '');
    
    if(str.length < 24){
         str = str.padStart(24, '0');
    }else if (str.length > 24){
        str = str.slice(-24)
    }
    
    return str;
}

export function isValidObjectId(id){

     return /^[0-9a-fA-F]{24}$/.test(id);
    
}

export function toObjectId(id){
    const hexString = to24CharHexString(id);
    if(!isValidObjectId(hexString)){
        throw new Error('Input must be a 24 character hex string 12 byte unit8Array, or an integer note that');
    }
    
    return objectId(hexString);
}