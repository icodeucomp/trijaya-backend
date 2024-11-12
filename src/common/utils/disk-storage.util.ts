import { diskStorage } from 'multer';
import * as os from 'os';
import * as path from 'path';

import { generateSlug } from './generate-slug.util';

export const storage = diskStorage({
  destination: (req, file, callback) => {
    const tmpDir = os.tmpdir();
    callback(null, tmpDir);
  },
  filename: (req, file, callback) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = generateSlug(
      path.basename(file.originalname, fileExtension),
    );
    callback(null, fileName);
  },
});

// In case changing to memory storage for storing temporary uploaded file
// export const storage = memoryStorage();
