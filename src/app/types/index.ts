export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: Date;
  status: 'pending' | 'completed';
  theme?: string;
  font?: string;
  photos?: string[]; // Array of base64 encoded images
  isSelected?: boolean; // For UI selection state
}

export interface Folder {
  id: string;
  name: string;
  createdAt: Date;
}

export interface TrashedItem {
  id: string;
  type: 'note' | 'folder';
  data: Note | Folder;
  deletedAt: Date;
}