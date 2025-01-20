import fs from 'fs';
import { StructuredLoggerServiceFactory } from '@endpoint/nestjs-core-module';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { AudioService } from './AudioService';

jest.mock('fs');

const mockPath = 'test-audio-file.wav';

describe(AudioService.name, () => {
  const mockConfigService = {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  } as unknown as jest.Mocked<ConfigService>;

  const mockLoggerService = StructuredLoggerServiceFactory.noOpStructuredLoggerService();

  const mockClient = {
    audio: {
      transcriptions: {
        create: jest.fn(),
      },
    },
  } as unknown as jest.Mocked<OpenAI>;

  let service: AudioService;

  beforeEach(() => {
    jest.resetAllMocks();
    mockConfigService.getOrThrow.mockImplementation((key) => {
      if (key === 'OPEN_AI_API_KEY') return 'test-api-key';
      if (key === 'OPEN_AI_PROJECT') return 'test-project';
      if (key === 'OPEN_AI_ORGANIZATION') return 'test-organization';
      if (key === 'OPEN_AI_MODEL') return 'test-model';

      return undefined;
    });

    service = new AudioService(mockLoggerService, mockConfigService);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).client = mockClient;
  });

  describe(AudioService.prototype.speechToText.name, () => {
    it('should transcribe speech from the provided audio file', async () => {
      const mockFileStream = {} as fs.ReadStream;
      const transcriptionText = 'This is a test transcription.';

      (fs.createReadStream as jest.Mock).mockReturnValue(mockFileStream);
      (mockClient.audio.transcriptions.create as jest.Mock).mockResolvedValue({ text: transcriptionText });

      const result = await service.speechToText(mockPath);

      expect(fs.createReadStream).toHaveBeenCalledWith(mockPath);
      expect(mockClient.audio.transcriptions.create).toHaveBeenCalledWith({
        file: mockFileStream,
        model: 'whisper-1',
      });

      expect(result).toEqual(transcriptionText);
    });

    it('should throw an error if transcription fails', async () => {
      const mockFileStream = {} as fs.ReadStream;
      const mockError = new Error('Transcription failed');

      (fs.createReadStream as jest.Mock).mockReturnValue(mockFileStream);
      (mockClient.audio.transcriptions.create as jest.Mock).mockRejectedValue(mockError);

      await expect(service.speechToText(mockPath)).rejects.toThrow(mockError);

      expect(fs.createReadStream).toHaveBeenCalledWith(mockPath);
      expect(mockClient.audio.transcriptions.create).toHaveBeenCalledWith({
        file: mockFileStream,
        model: 'whisper-1',
      });
    });
  });
});
