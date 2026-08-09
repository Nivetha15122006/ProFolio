const pdfParse = require('pdf-parse');

/**
 * Extracts readable plain text from a buffer representing a TXT or PDF file.
 */
async function extractText(buffer, mimeType, filename = '') {
  const lowerMime = (mimeType || '').toLowerCase();
  const lowerName = (filename || '').toLowerCase();
  
  if (lowerMime.includes('text') || lowerName.endsWith('.txt')) {
    // Plain text is converted directly
    return buffer.toString('utf8');
  } else if (lowerMime.includes('pdf') || lowerName.endsWith('.pdf')) {
    try {
      const data = await pdfParse(buffer);
      if (!data || typeof data.text !== 'string') {
        throw new Error("No readable text found in PDF file.");
      }
      return data.text;
    } catch (error) {
      console.error("[PDF Parser Error]", error);
      throw new Error("Failed to extract text from PDF. Ensure it contains selectable text and is not an scanned image or corrupted.");
    }
  } else {
    throw new Error("Unsupported file format. Please upload a PDF (.pdf) or Plain Text (.txt) file.");
  }
}

module.exports = {
  extractText
};
