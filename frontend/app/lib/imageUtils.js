/**
 * Image utility library for wardrobe image handling.
 */

/**
 * Validates an image file.
 * @param {File} file - The file to validate.
 * @returns {{valid: boolean, error: string}} Validation result.
 */
export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are supported.' };
  }
  
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit.' };
  }
  
  return { valid: true, error: '' };
}

/**
 * Converts a File to a data URL.
 * @param {File} file - The file to convert.
 * @returns {Promise<string>} A promise that resolves to the data URL.
 */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses an image file.
 * @param {File} file - The image file.
 * @param {number} [maxWidth=800] - The maximum width of the compressed image.
 * @param {number} [quality=0.8] - The quality of the output JPEG.
 * @returns {Promise<Blob>} A promise that resolves to the compressed image blob.
 */
export function compressImage(file, maxWidth = 800, quality = 0.8) {
  return new Promise(async (resolve, reject) => {
    try {
      const dataUrl = await fileToDataUrl(file);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas to Blob failed'));
          }
        }, 'image/jpeg', quality);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Creates a square thumbnail from an image file.
 * @param {File} file - The image file.
 * @param {number} [size=200] - The size of the square thumbnail.
 * @returns {Promise<string>} A promise that resolves to the thumbnail data URL.
 */
export function createThumbnail(file, size = 200) {
  return new Promise(async (resolve, reject) => {
    try {
      const dataUrl = await fileToDataUrl(file);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        
        const ctx = canvas.getContext('2d');
        
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => reject(new Error('Failed to load image for thumbnail'));
      img.src = dataUrl;
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Extracts the dominant color from an image element.
 * @param {HTMLImageElement} imageElement - The image element to analyze.
 * @returns {{hex: string, rgb: {r: number, g: number, b: number}, name: string}} The dominant color details.
 */
export function extractDominantColor(imageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = 10;
  canvas.height = 10;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0, 10, 10);
  
  const imageData = ctx.getImageData(0, 0, 10, 10).data;
  
  let r = 0, g = 0, b = 0;
  let count = 0;
  
  for (let i = 0; i < imageData.length; i += 4) {
    if (imageData[i + 3] > 0) { // Ignore transparent pixels
      r += imageData[i];
      g += imageData[i + 1];
      b += imageData[i + 2];
      count++;
    }
  }
  
  if (count === 0) {
    return { hex: '#000000', rgb: { r: 0, g: 0, b: 0 }, name: 'black' };
  }
  
  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);
  
  const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  
  // Basic color mapping
  let name = 'custom';
  if (r > 200 && g < 100 && b < 100) name = 'red';
  else if (r < 100 && g > 200 && b < 100) name = 'green';
  else if (r < 100 && g < 100 && b > 200) name = 'blue';
  else if (r > 200 && g > 200 && b > 200) name = 'white';
  else if (r < 50 && g < 50 && b < 50) name = 'black';
  else if (r > 150 && g > 150 && b > 150) name = 'gray';
  
  return { hex, rgb: { r, g, b }, name };
}
