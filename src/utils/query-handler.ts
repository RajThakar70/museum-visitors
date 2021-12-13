import https from 'https';
import { IMuseumData } from '../interfaces/meseum';

export const findMuseumVisitor = async ({ date }): Promise<{ status?: number, type?: string, data?: Array<IMuseumData> | string }> => {
  const params = new URLSearchParams({
    month: date,
  });

  const options = {
    hostname: 'data.lacity.org',
    port: 443,
    path: `/resource/trxm-jn3c.json?${params.toString()}`,
    method: 'GET',
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8');

      res.on('data', (data) => {
        try {
          const jsonResponse = JSON.parse(data);
          resolve({ status: res.statusCode, type: 'json', data: jsonResponse });
        } catch (error) {
          resolve({ status: res.statusCode, type: 'string', data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};
