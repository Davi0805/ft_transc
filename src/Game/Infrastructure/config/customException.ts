export type CustomExceptionT = Error & {
    statusCode: number
}

export default function exception(message: string, statusCode: number): CustomExceptionT
{
    const error: CustomExceptionT = new Error(message) as CustomExceptionT;
    error.statusCode = statusCode;
    return error; 
}