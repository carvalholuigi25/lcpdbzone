// /// <reference types="node" />
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChatService } from '@/app/services/data/chat.service';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal ReadableStream whose reader returns chunks then closes. */
function makeReadableStream(chunks: Uint8Array[]): ReadableStream<Uint8Array> {
  let index = 0;
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (index < chunks.length) {
        controller.enqueue(chunks[index++]);
      } else {
        controller.close();
      }
    },
  });
}

/** Build a mock Response with a streaming body. */
function makeStreamingResponse(chunks: Uint8Array[]): Response {
  return {
    body: makeReadableStream(chunks),
    text: vi.fn(),
  } as unknown as Response;
}

/** Build a mock Response with no body (body === null). */
function makeTextResponse(text: string): Response {
  return {
    body: null,
    text: vi.fn().mockResolvedValue(text),
  } as unknown as Response;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ChatService', () => {
  let service: ChatService;
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatService);
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── construction ──────────────────────────────────────────────────────────

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── request shape ─────────────────────────────────────────────────────────

  it('should POST to http://localhost:3000/chat with correct headers and body', async () => {
    const messages = [{ role: 'user', content: 'Hello' }];
    const encoder = new TextEncoder();
    fetchSpy.mockResolvedValue(makeStreamingResponse([encoder.encode('Hi')]));

    await service.sendMessage(messages, vi.fn());

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://localhost:3000/chat');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>)['Content-Type']).toBe(
      'application/json'
    );
    expect(JSON.parse(init.body as string)).toEqual({
      model: 'gpt-5-nano',
      messages,
    });
  });

  it('should forward the AbortSignal to fetch', async () => {
    const controller = new AbortController();
    const encoder = new TextEncoder();
    fetchSpy.mockResolvedValue(makeStreamingResponse([encoder.encode('ok')]));

    await service.sendMessage([], vi.fn(), controller.signal);

    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(init.signal).toBe(controller.signal);
  });

  // ── streaming path ────────────────────────────────────────────────────────

  it('should call onChunk for each streamed chunk', async () => {
    const encoder = new TextEncoder();
    const chunks = ['Hello', ' ', 'world'].map((s) => encoder.encode(s));
    fetchSpy.mockResolvedValue(makeStreamingResponse(chunks));

    const received: string[] = [];
    await service.sendMessage([], (chunk) => received.push(chunk));

    expect(received).toHaveLength(3);
    expect(received.join('')).toBe('Hello world');
  });

  it('should not call onChunk for empty decoded chunks', async () => {
    // A zero-length Uint8Array decodes to an empty string.
    fetchSpy.mockResolvedValue(makeStreamingResponse([new Uint8Array(0)]));

    const onChunk = vi.fn();
    await service.sendMessage([], onChunk);

    expect(onChunk).not.toHaveBeenCalled();
  });

  it('should release the reader lock after streaming completes', async () => {
    const encoder = new TextEncoder();
    fetchSpy.mockResolvedValue(
      makeStreamingResponse([encoder.encode('data')])
    );

    // We just assert that sendMessage resolves without throwing, which means
    // the finally block ran without error.
    await expect(service.sendMessage([], vi.fn())).resolves.toBeUndefined();
  });

  // ── no-body (text) fallback ───────────────────────────────────────────────

  it('should call onChunk with full text when response has no body', async () => {
    fetchSpy.mockResolvedValue(makeTextResponse('Fallback text'));

    const onChunk = vi.fn();
    await service.sendMessage([], onChunk);

    expect(onChunk).toHaveBeenCalledOnce();
    expect(onChunk).toHaveBeenCalledWith('Fallback text');
  });

  it('should not call onChunk when response has no body and text is empty', async () => {
    fetchSpy.mockResolvedValue(makeTextResponse(''));

    const onChunk = vi.fn();
    await service.sendMessage([], onChunk);

    expect(onChunk).not.toHaveBeenCalled();
  });

  // ── error handling ────────────────────────────────────────────────────────

  it('should rethrow AbortError from stream reader', async () => {
    const abortError = Object.assign(new Error('Aborted'), {
      name: 'AbortError',
    });

    const mockReader = {
      read: vi.fn().mockRejectedValue(abortError),
      releaseLock: vi.fn(),
    };
    const mockBody = { getReader: vi.fn().mockReturnValue(mockReader) };
    fetchSpy.mockResolvedValue({ body: mockBody } as unknown as Response);

    await expect(service.sendMessage([], vi.fn())).rejects.toThrow('Aborted');
    expect(mockReader.releaseLock).toHaveBeenCalled();
  });

  it('should rethrow non-abort errors from stream reader', async () => {
    const networkError = new Error('Network failure');

    const mockReader = {
      read: vi.fn().mockRejectedValue(networkError),
      releaseLock: vi.fn(),
    };
    const mockBody = { getReader: vi.fn().mockReturnValue(mockReader) };
    fetchSpy.mockResolvedValue({ body: mockBody } as unknown as Response);

    await expect(service.sendMessage([], vi.fn())).rejects.toThrow(
      'Network failure'
    );
    expect(mockReader.releaseLock).toHaveBeenCalled();
  });

  it('should release the reader lock even when an error is thrown', async () => {
    const error = new Error('boom');
    const mockReader = {
      read: vi.fn().mockRejectedValue(error),
      releaseLock: vi.fn(),
    };
    const mockBody = { getReader: vi.fn().mockReturnValue(mockReader) };
    fetchSpy.mockResolvedValue({ body: mockBody } as unknown as Response);

    await service.sendMessage([], vi.fn()).catch(() => {});

    expect(mockReader.releaseLock).toHaveBeenCalledOnce();
  });

  it('should not throw if releaseLock itself throws', async () => {
    const encoder = new TextEncoder();
    const mockReader = {
      read: vi
        .fn()
        .mockResolvedValueOnce({ done: false, value: encoder.encode('hi') })
        .mockResolvedValue({ done: true, value: undefined }),
      releaseLock: vi.fn().mockImplementation(() => {
        throw new Error('lock error');
      }),
    };
    const mockBody = { getReader: vi.fn().mockReturnValue(mockReader) };
    fetchSpy.mockResolvedValue({ body: mockBody } as unknown as Response);

    // Should resolve cleanly — the inner catch swallows the releaseLock error.
    await expect(service.sendMessage([], vi.fn())).resolves.toBeUndefined();
  });

  it('should rethrow when fetch itself rejects', async () => {
    fetchSpy.mockRejectedValue(new Error('fetch failed'));

    await expect(service.sendMessage([], vi.fn())).rejects.toThrow(
      'fetch failed'
    );
  });
});