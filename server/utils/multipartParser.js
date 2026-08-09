/**
 * Parses multipart/form-data bodies natively using Buffers.
 */
function parseMultipart(bodyBuffer, contentTypeHeader) {
  const boundaryMatch = contentTypeHeader.match(/boundary=(.+)/);
  if (!boundaryMatch) {
    throw new Error("No boundary found in Content-Type header");
  }
  
  const boundary = '--' + boundaryMatch[1];
  const boundaryBuffer = Buffer.from(boundary);
  const parts = [];
  
  let index = bodyBuffer.indexOf(boundaryBuffer);
  
  while (index !== -1) {
    const nextIndex = bodyBuffer.indexOf(boundaryBuffer, index + boundaryBuffer.length);
    if (nextIndex === -1) break;
    
    // Slice out the current chunk including headers and data
    const partBuffer = bodyBuffer.slice(index + boundaryBuffer.length, nextIndex);
    
    // Find the boundary between headers and binary body (\r\n\r\n)
    const headerEndIndex = partBuffer.indexOf(Buffer.from('\r\n\r\n'));
    if (headerEndIndex !== -1) {
      const headersString = partBuffer.slice(0, headerEndIndex).toString('utf8');
      
      const contentDisposition = headersString.match(/Content-Disposition:\s*form-data;\s*name="([^"]+)"(?:;\s*filename="([^"]+)")?/i);
      const contentTypeMatch = headersString.match(/Content-Type:\s*([^\r\n]+)/i);
      
      if (contentDisposition) {
        const name = contentDisposition[1];
        const filename = contentDisposition[2] || null;
        const mimeType = contentTypeMatch ? contentTypeMatch[1].trim() : null;
        
        // Extract the file body, removing leading \r\n\r\n and trailing \r\n
        let dataBuffer = partBuffer.slice(headerEndIndex + 4);
        
        // Remove trailing \r\n from content
        if (dataBuffer.length >= 2 && dataBuffer[dataBuffer.length - 2] === 13 && dataBuffer[dataBuffer.length - 1] === 10) {
          dataBuffer = dataBuffer.slice(0, -2);
        }
        
        parts.push({
          name,
          filename,
          mimeType,
          data: dataBuffer
        });
      }
    }
    
    index = nextIndex;
  }
  
  return parts;
}

module.exports = { parseMultipart };
