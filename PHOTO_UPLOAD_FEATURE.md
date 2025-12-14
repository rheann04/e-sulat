# Photo Upload Feature for Notes

## Overview
The photo upload feature allows users to attach images to their notes, making them more visual and expressive.

## Features

### 📷 Photo Upload
- **Multiple file support**: Upload multiple images at once
- **File format support**: JPG, PNG, GIF files
- **Base64 storage**: Images are stored as base64 strings in localStorage
- **Drag & drop interface**: Easy-to-use upload interface

### 🖼️ Photo Management
- **Photo gallery**: View all photos attached to a note
- **Photo viewer**: Click on any photo to view it in full size
- **Delete photos**: Remove unwanted photos with a single click
- **Photo counter**: Visual indicator showing number of photos in a note

### 📝 Photo References & Text Wrapping
- **Insert references**: Add photo references with wrapping options into note content
- **Text wrapping**: Choose how text flows around photos (left, right, center, or block)
- **Live preview**: See how photos will appear with text in the preview section
- **Visual indicators**: Notes with photos show a photo icon and count in the folder view
- **Easy insertion**: Click any photo to choose wrapping style and insert

## How to Use

### Adding Photos to a Note
1. Open any note for editing
2. Click the "Photos" button at the bottom
3. Click the upload area or drag files to upload
4. Photos will appear in the gallery below

### Managing Photos
- **View**: Click on any photo thumbnail to view it full size
- **Delete**: Hover over a photo and click the "×" button
- **Insert with wrapping**: Click any photo to choose how text wraps around it:
  - **Block**: Full width photo (default)
  - **Center**: Centered photo with text above and below
  - **Wrap Left**: Photo on left, text flows around the right
  - **Wrap Right**: Photo on right, text flows around the left

### Visual Indicators
- Notes with photos show a blue photo icon with count in the folder view
- The Photos button shows a badge with the number of attached photos
- Photos button has a blue ring when photos are present

## Technical Implementation

### Data Structure
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: Date;
  status: 'pending' | 'completed';
  theme?: string;
  font?: string;
  photos?: string[]; // Array of base64 encoded images
}
```

### Storage
- Photos are stored as base64 encoded strings
- Stored in localStorage along with other note data
- No external dependencies required

### File Handling
- Client-side file reading using FileReader API
- Automatic base64 conversion
- Multiple file selection support
- Image format validation

## Browser Compatibility
- Works in all modern browsers that support:
  - FileReader API
  - localStorage
  - Base64 encoding
  - CSS Grid and Flexbox

## Performance Considerations
- Large images are stored as base64, which increases storage size by ~33%
- Consider image compression for production use
- localStorage has size limits (typically 5-10MB per domain)

### Text Wrapping Syntax
- `[Photo 1]` - Block photo (full width)
- `[Photo 1 center]` - Centered photo
- `[Photo 1 wrap-left]` - Photo floated left, text wraps right
- `[Photo 1 wrap-right]` - Photo floated right, text wraps left

## Future Enhancements
- Image compression before storage
- Cloud storage integration
- Image editing capabilities
- Drag & drop reordering
- Photo captions and metadata
- Advanced text wrapping controls
- Photo resizing options