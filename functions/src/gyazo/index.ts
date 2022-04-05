
import * as functions from 'firebase-functions';
import FormData from 'form-data';
import axios from 'axios';
import { isAuthed } from '../lib/auth';

type UploadImageError = 'forbidden' | 'gyazo-error' | 'invalid-request' | null;
type UploadImageRet = {
  err: UploadImageError,
  url: string | null,
};

export const uploadImage =
  functions.region('asia-northeast1').https.onCall(async (data, context): Promise<UploadImageRet> => {
    if (!isAuthed(context.auth)) {
      return {
        err: 'forbidden',
        url: null,
      };
    }

    const b64Image = data.b64Image;
    const filetype = data.filetype;
    if (!(b64Image && filetype && filetype.match(/image.*/))) {
      return {
        err: 'invalid-request',
        url: null,
      };
    }
    const image = Buffer.from(b64Image, 'base64');

    const formData = new FormData();
    formData.append('access_token', process.env.GYAZO_ACCESS_TOKEN);
    formData.append('imagedata', image, {
      filename: 'wywiwya.png',
      contentType: filetype,
    });

    const headers = {
      Accept: '*/*',
      ...formData.getHeaders(),
    };
    const result = await axios.post('https://upload.gyazo.com/api/upload', formData, {
      headers,
    }).then((res) => {
      return res;
    }).catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e); // TODO
      return null;
    });
    if (result === null || result.status !== 200) {
      return {
        err: 'gyazo-error',
        url: null,
      };
    }

    return {
      err: null,
      url: result.data.url,
    };
  });
