export const API_URL = 'http://localhost:4000';

export type Trip = {
  id: string;
  title: string;
  date: string;
  slug: string;
  visibility: 'private' | 'public';
  status: 'draft' | 'published';
  coverPosition?: 'top' | 'center' | 'bottom';
  startDate?: string;
  endDate?: string;
  publicDescription?: string;
  description: string | null;
  country: string | null;
  routeSummary: string | null;
  createdAt: string;
  updatedAt: string;
  photos?: Photo[];
  _count?: {
    photos: number;
  };
};

export type TripFormValues = {
  title: string;
  country: string;
  routeSummary: string;
  startDate: string;
  endDate: string;
  description: string;
  publicDescription: string;
  visibility: Trip['visibility'];
  status: Trip['status'];
};

export type Photo = {
  id: string;
  tripId: string;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  caption?: string;
  visibility: 'private'  | 'public';
  isCover?: boolean;
  takenAt?: string;
  createdAt: string;
  updatedAt: string;
  originalFileName?: string | null;
  fileSize?: number | null;
};

export type CreateTripPayload = {
  title: string;
  country: string;
  routeSummary: string;
  startDate: string;
  endDate: string;
  description: string;
  publicDescription: string;
  visibility: Trip['visibility'];
  status: Trip['status'];
};

export type UpdateTripPayload = Partial<CreateTripPayload>;

export type CreatePhotoPayload = {
  url: string;
  thumbnailUrl?: string;
  title?: string;
  caption?: string;
  visibility?: Photo['visibility'];
  isCover?: boolean;
  takenAt?: string;
  originalFileName?: string;
  fileSize?: number;
};

export type TripCity = {
  id: string;
  tripId: string;
  name: string;
  country: string | null;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateTripCityPayload = {
  name: string;
  country?: string | null;
  lat: number;
  lng: number;
};

export type TravelMapCity = TripCity & {
  trip: {
    id: string;
    title: string;
    slug: string;
    country: string | null;
  };
};

export type UpdatePhotoPayload = Partial<CreatePhotoPayload>;

export type CloudinaryUploadSignature = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
};




export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json() as Promise<{
    message: string;
    token: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  }>;
}

export async function getTrips(): Promise<{ trips: Trip[] }> {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/trips`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch trips');
  }
  return response.json();
}

export async function getTripById(id: string): Promise<{ trip: Trip }> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/trips/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Trip not found');
  }
  return response.json();
}



export async function getPublicTrips(): Promise<{ trips: Trip[] }> {
  const response = await fetch(`${API_URL}/public-trips`);
  if (!response.ok) {
    throw new Error('Failed to fetch public trips');
  }
  return response.json();
}


export async function setPhotoAsCover(photoId: string): Promise<{ photo: Photo }> {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/photos/${photoId}/set-cover`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to set cover photo');
  }

  return response.json();
}

export async function getPublicTripBySlug(
  slug: string
): Promise<{ trip: Trip }> {
  const response = await fetch(`${API_URL}/public-trips/${slug}`);
  if (!response.ok) {
    throw new Error('Public trip not found');
  }
  return response.json();
}



function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function getApiErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const data = (await response.json()) as {
      message?: string;
      errors?: { path: string; message: string }[];
    };

    if (data.errors?.length) {
      return data.errors
        .map((issue) => `${issue.path}: ${issue.message}`)
        .join('; ');
    }

    if (data.message) {
      return data.message;
    }
  } catch {
    // response body is not JSON
  }

  return fallback;
}

export async function createTrip(
  payload: CreateTripPayload
): Promise<{ trip: Trip }> {
  const response = await fetch(`${API_URL}/trips`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, 'Failed to create trip'),
    );
  }
  return response.json();
}

export async function updateTrip(
  id: string,
  payload: UpdateTripPayload
): Promise<{ trip: Trip }> {
  const response = await fetch(`${API_URL}/trips/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, 'Failed to update trip'),
    );
  }

  return response.json();
}

export async function deleteTrip(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/trips/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete trip');
  }
}



export async function getCloudinaryUploadSignature(): Promise<CloudinaryUploadSignature> {
  const response = await fetch(`${API_URL}/api/uploads/cloudinary-signature`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to get Cloudinary upload signature');
  }

  return response.json();
}

export async function getTripPhotos(
  tripId: string,
): Promise<{ photos: Photo[] }> {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/trips/${tripId}/photos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Photos not found');
  }

  return response.json();
}

export async function createPhoto(
  tripId: string,
  payload: CreatePhotoPayload
): Promise<{ photo: Photo }> {
  const response = await fetch(`${API_URL}/trips/${tripId}/photos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create photo');
  }

  return response.json();
}

export async function updatePhoto(
  id: string,
  payload: UpdatePhotoPayload
): Promise<void> {
  const response = await fetch(`${API_URL}/photos/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update photo');
  }
}

export async function deletePhoto(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/photos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete photo');
  }
}

export async function getTripCities(
  tripId: string
): Promise<{ cities: TripCity[] }> {
  const response = await fetch(`${API_URL}/trips/${tripId}/cities`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch trip cities');
  }

  return response.json();
}

export async function createTripCity(
  tripId: string,
  payload: CreateTripCityPayload
): Promise<{ city: TripCity }> {
  const response = await fetch(`${API_URL}/trips/${tripId}/cities`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create trip city');
  }

  return response.json();
}

export async function deleteTripCity(cityId: string): Promise<void> {
  const response = await fetch(`${API_URL}/trips/cities/${cityId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete trip city');
  }
}

export async function getTravelMapCities(): Promise<{
  cities: TravelMapCity[];
}> {
  const response = await fetch(`${API_URL}/travel-map/cities`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch travel map cities');
  }

  return response.json();
}
