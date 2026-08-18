import { triggerBlobDownload } from './download-file.utils';

describe('triggerBlobDownload', () => {
  it('should create an object url, click anchor, and revoke object url', () => {
    const fakeBlob = new Blob(['test content'], { type: 'text/plain' });
    const createObjectURLSpy = spyOn(
      window.URL,
      'createObjectURL',
    ).and.returnValue('blob:http://localhost/test-uuid');
    const revokeObjectURLSpy = spyOn(window.URL, 'revokeObjectURL');
    const appendChildSpy = spyOn(
      document.body,
      'appendChild',
    ).and.callThrough();
    const removeChildSpy = spyOn(
      document.body,
      'removeChild',
    ).and.callThrough();

    triggerBlobDownload(fakeBlob, 'test-report.csv');

    expect(createObjectURLSpy).toHaveBeenCalledWith(fakeBlob);
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith(
      'blob:http://localhost/test-uuid',
    );
  });
});
