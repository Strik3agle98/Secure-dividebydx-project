export const enum ErrorCodes {
  DuplicateKeyError = 11000,
}

export const isMongoError = (err: any, errType: ErrorCodes) => {
  return err.code && err.code === errType;
};
