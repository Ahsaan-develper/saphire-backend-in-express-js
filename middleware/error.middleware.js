class AppError  extends Error {
    constructor (message , statusCode , errorCode){
        super(message)
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = true;
        Error.captureStackTrace(this , this.constructor);
    }
}


class BadRequestError extends AppError {
    constructor (message = "Bad Request"){
        super(message , 400 , "BAD REQUEST");
    }
}


class UnAuthorizedError extends AppError {
    constructor (message = "UnAuthorized"){
        super(message , 401 , "UNAUTHORIZED");
    }
}

class ForbiddenError extends AppError {
    constructor (message = "Forbidden Error"){
        super(message , 403 , "FORBIDDEN");
    }
}

class NotFoundError extends AppError {
    constructor (message = "Not Found Error"){
        super(message , 404 , "NOT FOUND ");
    }
}

class ConflictError extends AppError {
    constructor (message = "Conflict Error"){
        super(message , 409 , "CONFLICT ERROR");
    }
}

class ValidationError extends AppError {
    constructor (message = "Validation Error"){
        super(message , 422 , "VALIDATION ERROR");
    }
}

class InternalServerError extends AppError {
     constructor (message = "Internel Server Error"){
        super(message , 500 , "INTERNAL SERVER ERROR");
    }
}

export  {BadRequestError , UnAuthorizedError , ConflictError , NotFoundError , ValidationError , InternalServerError  , ForbiddenError};