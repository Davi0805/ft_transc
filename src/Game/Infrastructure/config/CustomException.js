function customException(message, statusCode)
{
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

module.exports = customException;