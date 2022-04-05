import { Editor, Position } from 'codemirror';
import { httpsCallable } from 'firebase/functions';
import { getProjectFunctions } from '~/plugins/firebase';

export const uploadImage = (file: File, editor: Editor, insertRange: {
  start: Position,
  end: Position,
}): void => {
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);

  fileReader.onload = async () => {
    if (fileReader.result === null) {
      return;
    }
    const b64Image = Buffer.from(fileReader.result).toString('base64');
    const functions = getProjectFunctions();
    const f = httpsCallable(functions, 'uploadImage');
    return await f({
      b64Image,
      filetype: file.type,
    }).then((res) => {
      // Replace with returned URL
      const link: string = (res.data as any).url;
      editor.replaceRange(`![](${link})`, insertRange.start, insertRange.end);
    }).catch((e) => {
      // eslint-disable-next-line no-console
      console.error('Faled to upload image...', e);
      editor.replaceRange(`![](Failed to upload image: ${file.name})`, insertRange.start, insertRange.end);
    });
  };
};
