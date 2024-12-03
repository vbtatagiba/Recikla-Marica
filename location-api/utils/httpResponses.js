////////////////////////////////////////////////////////////////
//                           PATTERNS:                        //
// -> 'successResponse': RETURN AN ARRAY                      //
// ->'serverErrorResponse' AND 'clientErrorResponse': RETURNS //
//             'errorType' AND THE 'error'                    //
////////////////////////////////////////////////////////////////

function successResponse(array, res) {
  res.status(200).json(array);
}

function serverErrorResponse(type, errorMessage, res) {
  const SERVER_ERROR_TYPES = {
    UNKNOWN_CAUSE_OF_ERROR: 500,
    TRACKED_CAUSE_OF_ERROR: 502,
  };

  let isExistingTypeError;

  for ([serverErrorType, serverErrorCode] of Object.entries(
    SERVER_ERROR_TYPES
  )) {
    if (type == serverErrorType) {
      isExistingTypeError = true;
    }
  }

  if (isExistingTypeError) {
    const errorCode = SERVER_ERROR_TYPES[type];
    const errorType = `SERVER_ERROR.${type}`;
    const message = { errorType, error: errorMessage };
    res.status(errorCode).json(message);
  } else {
    const errorCode = SERVER_ERROR_TYPES.TRACKED_CAUSE_OF_ERROR;
    const errorType = `SERVER_ERROR.TRACKED_CAUSE_OF_ERROR`;
    const errorMessage = `serverErrorResponse of type: '${type}' doesn't exist. Please supply an available clientErrorType: UNKNOWN_CAUSE_OF_ERROR || TRACKED_CAUSE_OF_ERROR`;
    const message = { errorType, error: errorMessage };
    res.status(errorCode).json(message);
  }
}

function clientErrorResponse(type, errorMessage, res) {
  const CLIENT_ERROR = {
    INVALID_REQUEST: 400,
    RESOURCE_NOT_FOUND: 404,
  };

  let isExistingType;

  for ([clientErrorType, clientErrorCode] of Object.entries(CLIENT_ERROR)) {
    if (type == clientErrorType) {
      isExistingType = true;
    }
  }

  if (isExistingType) {
    const errorCode = CLIENT_ERROR[type];
    const errorType = `CLIENT_ERROR.${type}`;
    const message = { errorType, error: errorMessage };
    res.status(errorCode).json(message);
  } else {
    const errorMessage = `clientErrorType of type: '${type}' doesn't exist. Please supply an available clientErrorType: INVALID_REQUEST || RESOURCE_NOT_FOUND`;
    serverErrorResponse('TRACKED_CAUSE_OF_ERROR', errorMessage, res);
  }
}

module.exports = { successResponse, clientErrorResponse, serverErrorResponse };
