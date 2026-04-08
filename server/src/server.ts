import app from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`HOMATZ API running on port ${PORT} [${env.NODE_ENV}]`);
});