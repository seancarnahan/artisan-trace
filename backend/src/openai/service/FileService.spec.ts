import fs from 'fs';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { FileService } from './FileService';

jest.mock('fs');

describe(FileService.name, () => {
  const mockConfigService = {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  } as unknown as jest.Mocked<ConfigService>;

  const mockLoggerService = StructuredLoggerServiceFactory.noOpStructuredLoggerService();

  const mockClient = {
    files: {
      list: jest.fn(),
      create: jest.fn(),
    },
  } as unknown as jest.Mocked<OpenAI>;

  const mockPath = '/path/to/file.txt';
  const mockFileName = 'file.txt';
  const existingFileId = 'existing-file-id';
  const newFileId = 'new-file-id';

  let service: FileService;

  beforeEach(() => {
    jest.resetAllMocks();
    mockConfigService.getOrThrow.mockImplementation((key) => {
      if (key === 'OPEN_AI_API_KEY') return 'test-api-key';
      if (key === 'OPEN_AI_PROJECT') return 'test-project';
      if (key === 'OPEN_AI_ORGANIZATION') return 'test-organization';
      if (key === 'OPEN_AI_MODEL') return 'test-model';

      return undefined;
    });

    service = new FileService(mockLoggerService, mockConfigService);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).client = mockClient;
  });

  describe(FileService.prototype.uploadOrGetFile.name, () => {
    it('should return the ID of an existing file', async () => {
      const mockFiles = { data: [{ filename: mockFileName, id: existingFileId }] };

      (mockClient.files.list as jest.Mock).mockResolvedValue(mockFiles);
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = await service.uploadOrGetFile(mockPath);

      expect(mockClient.files.list).toHaveBeenCalledTimes(1);
      expect(fs.existsSync).toHaveBeenCalledWith(mockPath);
      expect(result).toEqual(existingFileId);
    });

    it('should upload a file and return the new file ID if it does not exist', async () => {
      const mockFiles = { data: [] };
      const mockCreatedFile = { id: newFileId };

      (mockClient.files.list as jest.Mock).mockResolvedValue(mockFiles);
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.createReadStream as jest.Mock).mockReturnValue({} as fs.ReadStream);
      (mockClient.files.create as jest.Mock).mockResolvedValue(mockCreatedFile);

      const result = await service.uploadOrGetFile(mockPath);

      expect(mockClient.files.list).toHaveBeenCalledTimes(1);
      expect(fs.existsSync).toHaveBeenCalledWith(mockPath);
      expect(fs.createReadStream).toHaveBeenCalledWith(mockPath);
      expect(mockClient.files.create).toHaveBeenCalledWith({
        file: expect.any(Object),
        purpose: 'assistants',
      });

      expect(result).toEqual(newFileId);
    });

    it('should throw an error if the file does not exist locally', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await expect(service.uploadOrGetFile(mockPath)).rejects.toThrow('File not found at local path');

      expect(fs.existsSync).toHaveBeenCalledWith(mockPath);
      expect(mockClient.files.list).toHaveBeenCalledTimes(0);
    });

    it('should throw an error if file creation fails', async () => {
      const mockFiles = { data: [] };
      const mockCreatedFile = { id: undefined };

      (mockClient.files.list as jest.Mock).mockResolvedValue(mockFiles);
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.createReadStream as jest.Mock).mockReturnValue({} as fs.ReadStream);
      (mockClient.files.create as jest.Mock).mockResolvedValue(mockCreatedFile);

      await expect(service.uploadOrGetFile(mockPath)).rejects.toThrow('Error creating file');

      expect(mockClient.files.list).toHaveBeenCalledTimes(1);
      expect(fs.existsSync).toHaveBeenCalledWith(mockPath);
      expect(fs.createReadStream).toHaveBeenCalledWith(mockPath);
      expect(mockClient.files.create).toHaveBeenCalledWith({
        file: expect.any(Object),
        purpose: 'assistants',
      });
    });
  });
});
