import { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  createPhoto,
  getCloudinaryUploadSignature,
} from '../../shared/api';
import type { Photo } from '../../shared/api';
import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';

type PhotoUploadFormProps = {
  tripId: string;
  existingPhotos: Photo[];
  onCreated: (photo: Photo) => void;
};

type CloudinaryUploadResponse = {
  secure_url: string;
};

type UploadStatus = 'pending' | 'uploading' | 'uploaded' | 'failed';

type FileUploadItem = {
  id: string;
  file: File;
  status: UploadStatus;
  errorLabel?: string;
};

const STATUS_LABELS: Record<UploadStatus, string> = {
  pending: 'Ожидает',
  uploading: 'Загрузка...',
  uploaded: 'Загружено',
  failed: 'Ошибка',
};

const STATUS_COLORS: Record<
  UploadStatus,
  'default' | 'info' | 'success' | 'error'
> = {
  pending: 'default',
  uploading: 'info',
  uploaded: 'success',
  failed: 'error',
};

function getThumbnailUrl(secureUrl: string): string {
  if (secureUrl.includes('/upload/')) {
    return secureUrl.replace('/upload/', '/upload/c_fill,w_300,h_300/');
  }

  return secureUrl;
}

function formatFileSizeMb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(2);
}

function isHeicFile(file: File): boolean {
  const fileName = file.name.toLowerCase();

  return fileName.endsWith('.heic') || fileName.endsWith('.heif');
}

async function convertHeicToJpeg(file: File): Promise<File> {
  const convertedBlob = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.9,
  });

  const blob = Array.isArray(convertedBlob)
    ? convertedBlob[0]
    : convertedBlob;

  return new File(
    [blob],
    file.name.replace(/\.(heic|heif)$/i, '.jpg'),
    {
      type: 'image/jpeg',
      lastModified: file.lastModified,
    },
  );
}

async function compressImage(file: File): Promise<File> {
  if (file.size < 1024 * 1024) {
    return file;
  }

  return imageCompression(file, {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 3000,
    useWebWorker: true,
  });
}

async function prepareFileForUpload(file: File): Promise<File> {
  let processedFile = file;
  if (isHeicFile(processedFile)) {
    processedFile = await convertHeicToJpeg(processedFile);
  }
  processedFile = await compressImage(processedFile);

  const originalSize = (file.size / 1024 / 1024).toFixed(2);
const compressedSize = (
  processedFile.size /
  1024 /
  1024
).toFixed(2);

console.log(
  `${file.name}: ${originalSize} MB → ${compressedSize} MB`
);
  return processedFile;
}


function isImageFile(file: File) {
  const fileName = file.name.toLowerCase();

  return (
    file.type.startsWith('image/') ||
    fileName.endsWith('.heic') ||
    fileName.endsWith('.heif')
  );
}

function getItemStatusLabel(item: FileUploadItem): string {
  if (item.errorLabel) {
    return item.errorLabel;
  }

  return STATUS_LABELS[item.status];
}

function createFileUploadItem(file: File): FileUploadItem {
  if (!isImageFile(file)) {
    return {
      id: crypto.randomUUID(),
      file,
      status: 'failed',
      errorLabel: 'Не изображение',
    };
  }

  return {
    id: crypto.randomUUID(),
    file,
    status: 'pending',
  };
}

export function PhotoUploadForm({ tripId, existingPhotos, onCreated }: PhotoUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileItems, setFileItems] = useState<FileUploadItem[]>([]);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState<Photo['visibility']>('private');
  const [takenAt, setTakenAt] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadedCount = fileItems.filter(
    (item) => item.status === 'uploaded',
  ).length;

  function updateFileStatus(id: string, status: UploadStatus) {
    setFileItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    );
  }

  function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    setFileItems(selectedFiles.map(createFileUploadItem));
    setError('');
  }

  function clearForm() {
    setFileItems([]);
    setTitle('');
    setCaption('');
    setVisibility('private');
    setTakenAt('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function uploadToCloudinary(
    selectedFile: File,
    signature: Awaited<ReturnType<typeof getCloudinaryUploadSignature>>,
  ): Promise<string> {
    const fileForUpload = await prepareFileForUpload(selectedFile);
  
    const formData = new FormData();
    formData.append('file', fileForUpload);
    formData.append('api_key', signature.apiKey);
    formData.append('timestamp', String(signature.timestamp));
    formData.append('signature', signature.signature);
formData.append('folder', signature.folder);


    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary upload failed:', errorText);
    
      throw new Error('Failed to upload image to Cloudinary');
    }

    const data = (await response.json()) as CloudinaryUploadResponse;

    if (!data.secure_url) {
      throw new Error('Cloudinary did not return a secure URL');
    }

    return data.secure_url;
  }

  function isDuplicateFile(file: File) {
    return existingPhotos.some(
      (photo) =>
        photo.originalFileName === file.name &&
        photo.fileSize === file.size,
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
  
    if (fileItems.length === 0) {
      setError('Выбери хотя бы одно фото');
      return;
    }
  
    setIsSubmitting(true);
  
    const CONCURRENT_UPLOADS_LIMIT = 3;
    let hasFailure = false;
  
    try {
      const signature = await getCloudinaryUploadSignature();
  
      const uploadableItems = fileItems.filter(
        (item) => item.status !== 'uploaded',
      );
  
      async function uploadSingleItem(item: FileUploadItem) {
        if (isDuplicateFile(item.file)) {
          hasFailure = true;
  
          setFileItems((current) =>
            current.map((currentItem) =>
              currentItem.id === item.id
                ? {
                    ...currentItem,
                    status: 'failed',
                    errorLabel: 'Уже загружено',
                  }
                : currentItem,
            ),
          );
  
          return;
        }
  
        if (!isImageFile(item.file)) {
          hasFailure = true;
          return;
        }
  
        updateFileStatus(item.id, 'uploading');
  
        try {
          const secureUrl = await uploadToCloudinary(item.file, signature);
          const thumbnailUrl = getThumbnailUrl(secureUrl);
  
          const { photo } = await createPhoto(tripId, {
            url: secureUrl,
            thumbnailUrl,
            title: title.trim() || undefined,
            caption: caption.trim() || undefined,
            visibility,
            takenAt: takenAt || undefined,
            originalFileName: item.file.name,
            fileSize: item.file.size,
          });
  
          onCreated(photo);
          updateFileStatus(item.id, 'uploaded');
        } catch {
          hasFailure = true;
  
          setFileItems((current) =>
            current.map((currentItem) =>
              currentItem.id === item.id
                ? { ...currentItem, status: 'failed', errorLabel: undefined }
                : currentItem,
            ),
          );
        }
      }
  
      for (let index = 0; index < uploadableItems.length; index += CONCURRENT_UPLOADS_LIMIT) {
        const batch = uploadableItems.slice(
          index,
          index + CONCURRENT_UPLOADS_LIMIT,
        );
  
        await Promise.all(batch.map(uploadSingleItem));
      }
  
      if (hasFailure) {
        setError('Некоторые фото не удалось загрузить');
      } else {
        clearForm();
      }
    } catch {
      setError('Не удалось начать загрузку. Проверьте настройки Cloudinary.');
  
      setFileItems((current) =>
        current.map((item) =>
          item.status === 'uploading' || item.status === 'pending'
            ? { ...item, status: 'failed' }
            : item,
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gap: 2 }}>
        <Box>
          <Button
            variant="outlined"
            component="label"
            disabled={isSubmitting}
          >
            Выбрать изображение
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              disabled={isSubmitting}
              onChange={handleFilesChange}
            />
          </Button>

          {fileItems.length > 0 && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {isSubmitting
                ? `Загружено ${uploadedCount} из ${fileItems.length}`
                : `Выбрано файлов: ${fileItems.length}`}
            </Typography>
          )}
        </Box>

        {fileItems.length > 0 && (
          <List
            dense
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              maxHeight: 240,
              overflow: 'auto',
            }}
          >
            {fileItems.map((item) => (
              <ListItem key={item.id} divider>
                <ListItemText
                  primary={item.file.name}
                  secondary={`${formatFileSizeMb(item.file.size)} МБ`}
                />
                <Chip
                  label={getItemStatusLabel(item)}
                  size="small"
                  color={STATUS_COLORS[item.status]}
                  variant={item.status === 'pending' ? 'outlined' : 'filled'}
                />
              </ListItem>
            ))}
          </List>
        )}

        <TextField
          label="Название"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isSubmitting}
          fullWidth
        />

        <TextField
          label="Подпись"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          multiline
          minRows={2}
          disabled={isSubmitting}
          fullWidth
        />

        <TextField
          select
          label="Видимость"
          value={visibility}
          onChange={(event) =>
            setVisibility(event.target.value as Photo['visibility'])
          }
          disabled={isSubmitting}
          fullWidth
        >
          <MenuItem value="private">Private</MenuItem>
          <MenuItem value="public">Public</MenuItem>
        </TextField>

        <TextField
          label="Дата съёмки"
          type="date"
          value={takenAt}
          onChange={(event) => setTakenAt(event.target.value)}
          disabled={isSubmitting}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          fullWidth
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || fileItems.length === 0}
          >
            {isSubmitting ? 'Загружаем...' : 'Загрузить фото'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
