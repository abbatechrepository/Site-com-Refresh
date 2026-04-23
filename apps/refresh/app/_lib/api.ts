const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1";

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
  token?: string
): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {})
    }
  });

  if (!response.ok) {
    const message = await response.text();
    let parsedMessage = message;

    try {
      const parsed = JSON.parse(message) as { message?: string | string[] };
      if (Array.isArray(parsed.message)) {
        parsedMessage = parsed.message.join(" ");
      } else if (parsed.message) {
        parsedMessage = parsed.message;
      }
    } catch {
      parsedMessage = message;
    }

    const error = new Error(parsedMessage || "Falha ao comunicar com a API.") as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return response.json() as Promise<T>;
}

export async function safeApiRequest<T>(
  path: string,
  fallback: T,
  options?: RequestInit,
  token?: string
): Promise<T> {
  try {
    return await apiRequest<T>(path, options, token);
  } catch (requestError) {
    if (
      requestError instanceof Error &&
      "status" in requestError &&
      typeof requestError.status === "number" &&
      [401, 403, 404].includes(requestError.status)
    ) {
      return fallback;
    }

    throw requestError;
  }
}
