import { FastifyRequest, FastifyReply } from 'fastify';
import FastifyApp from '../../infrastructure/providers/FastifyApp';
import { IMuseumData } from '../../interfaces/meseum';
import { errorBuilder, responseBuilder } from '../../utils/builders';
import { findMuseumVisitor } from '../../utils/query-handler';

export class GetMuseumVisitors {
  public static async perform(
    req: FastifyRequest<{ Querystring: { date: string; ignore?: string } }>,
    rep: FastifyReply
  ): Promise<any> {
    try {
      const { date, ignore = '' } = req.query;

      const parsedTimestamp = parseInt(date);

      if (isNaN(parsedTimestamp)) {
        rep.code(422);
        return errorBuilder('date parameter not valid');
      }

      const dateFromTimestamp = new Date(parsedTimestamp);

      const year = dateFromTimestamp.getFullYear();
      const month = dateFromTimestamp.getMonth() + 1;
      const monthInString = dateFromTimestamp.toLocaleString('default', {
        month: 'short',
      });

      const { type, data, status } = await findMuseumVisitor({
        date: `${year}-${month}`,
      });

      if (type !== 'json' || status !== 200 || typeof data === 'string') {
        rep.code(422);
        return errorBuilder("can't process data");
      }

      const foundData = data[0];

      if (!foundData) {
        rep.code(404);
        return errorBuilder('data not found');
      }

      const visitorStats: any = GetMuseumVisitors.getMuseumVisitorStats(
        foundData,
        ignore
      );

      if (
        ignore &&
        typeof ignore === 'string' &&
        ignore !== 'month' &&
        foundData[ignore]
      ) {
        visitorStats.ignored = {
          museum: ignore,
          visitors: parseInt(foundData[ignore]),
        };
      }

      visitorStats.year = year;
      visitorStats.month = monthInString;

      rep.code(200);
      return responseBuilder({ attendance: visitorStats });
    } catch (err) {
      rep.code(500);
      return errorBuilder(err);
    }
  }

  public static getMuseumVisitorStats(
    museumData: IMuseumData,
    ignoreKey?: string
  ) {
    // const ignoreKeys = ['month'];
    // if (ignoreKey && typeof ignoreKey === 'string') {
    //   ignoreKeys.push(ignoreKey);
    // }
    const tempMuseumData = {...museumData};
    delete tempMuseumData.month;


    const stats = Object.keys(tempMuseumData).reduce(
      (finalResult, currentKey) => {

        if (ignoreKey === currentKey) {
          return finalResult;
        }

        const numberOfVisitors = parseInt(tempMuseumData[currentKey]);
        finalResult.total += numberOfVisitors;

        if (finalResult.highest.visitors < numberOfVisitors) {
          finalResult.highest.visitors = numberOfVisitors;
          finalResult.highest.museum = currentKey;
        }

        if (finalResult.lowest.visitors > numberOfVisitors) {
          finalResult.lowest.visitors = numberOfVisitors;
          finalResult.lowest.museum = currentKey;
        }

        return finalResult;
      },
      {
        highest: { museum: '', visitors: Number.MIN_SAFE_INTEGER },
        lowest: { museum: '', visitors: Number.MAX_SAFE_INTEGER },
        total: 0
      }
    );

    return stats;
  }
}
