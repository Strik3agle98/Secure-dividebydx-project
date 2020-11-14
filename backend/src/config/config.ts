import dotenv from "dotenv";

dotenv.config();

const config = {
  JWT_SECRET: process.env.JWT_SECRET!,
  NODE_PORT: process.env.NODE_PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_HOST: process.env.MONGODB_HOST,
  MONGODB_USER: process.env.MONGODB_USER,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
  MONGODB_DATABASE: process.env.MONGODB_DATABASE,
};

if (!config.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set");
}

if (
  !config.MONGODB_URI &&
  (!config.MONGODB_HOST ||
    !config.MONGODB_USER ||
    !config.MONGODB_PASSWORD ||
    !config.MONGODB_DATABASE)
) {
  throw new Error(
    "[MongoDB config] if URI isn't set, then must set user, password, and database"
  );
}

config.MONGODB_URI ||= `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

export default config;
