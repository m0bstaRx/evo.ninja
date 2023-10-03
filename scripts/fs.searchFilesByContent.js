const fs = require('fs');
const path = require('path');

const textFileExtensions = ['.txt', '.csv'];
const result = [];

// Mimic queue using two arrays
const enqueueStack = ["."];
const dequeueStack = [];

while (enqueueStack.length > 0 || dequeueStack.length > 0) {
  if (dequeueStack.length === 0) {
    while (enqueueStack.length > 0) {
      dequeueStack.push(enqueueStack.pop());
    }
  }

  const currentDir = dequeueStack.pop();
  let filenames;

  try {
    filenames = fs.readdirSync(currentDir);
  } catch (err) {
    continue;
  }

  filenames.forEach(filename => {
    const filepath = path.join(currentDir, filename);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      enqueueStack.push(filepath);
    } else if (textFileExtensions.includes(path.extname(filepath))) {
      const fileContent = fs.readFileSync(filepath, 'utf8');
      if (fileContent.includes(keyword)) {
        result.push(filepath);
      }
    }
  });
}

return result;
