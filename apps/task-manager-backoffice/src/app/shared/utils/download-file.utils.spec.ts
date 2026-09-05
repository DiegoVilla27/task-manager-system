import { triggerBlobDownload } from './download-file.utils';

describe('triggerBlobDownload', () => {
  it('should create object URL, click link and revoke object URL', () => {
    const mockBlob = new Blob(['test content'], { type: 'text/plain' });
    const createObjectURLSpy = spyOn(
      window.URL,
      'createObjectURL',
    ).and.returnValue('blob:http://localhost/123');
    const revokeObjectURLSpy = spyOn(window.URL, 'revokeObjectURL');

    triggerBlobDownload(mockBlob, 'test.txt');

    expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith(
      'blob:http://localhost/123',
    );
  });
});
