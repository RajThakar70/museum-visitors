import { expect, assert } from 'chai';
import FastifyApp from '../../src/infrastructure/providers/FastifyApp';

describe.only('Test for museum visitor get API', function () {
  this.timeout(0);

  it(`checking for timestamp: 1404198000000 and no ignore param`, async () => {
    // the single test
    try {
      const response = await FastifyApp.fastifyServer.inject({
        method: 'get',
        url: '/api/visitors',
        query: { date: '1404198000000' }
      });
      expect(response.statusMessage).equal('OK');
      const responseJson = response.json();
      expect(responseJson).has.keys(['error', 'message'])
      expect(responseJson.error).is.null;
      expect(responseJson.message).has.key('attendance');
      expect(responseJson.message.attendance).has.keys(['year', 'month', 'total', 'highest', 'lowest']);
      expect(responseJson.message.attendance.year).is.equal(2014);
      expect(responseJson.message.attendance.month).is.equal("Jul");
      expect(responseJson.message.attendance.total).is.equal(60535);
      expect(responseJson.message.attendance.highest).has.keys(['museum', 'visitors']);
      expect(responseJson.message.attendance.highest.museum).is.equal("avila_adobe");
      expect(responseJson.message.attendance.highest.visitors).is.equal(32378);
      expect(responseJson.message.attendance.lowest).has.keys(['museum', 'visitors']);
      expect(responseJson.message.attendance.lowest.museum).is.equal("hellman_quon");
      expect(responseJson.message.attendance.lowest.visitors).is.equal(120);
      
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  });

  it(`checking for timestamp: 1404198000000 and ignore: avila_adobe param`, async () => {
    // the single test
    try {
      const response = await FastifyApp.fastifyServer.inject({
        method: 'get',
        url: '/api/visitors',
            query: { date: '1404198000000', ignore: 'avila_adobe' }
      });
      expect(response.statusMessage).equal('OK');
      const responseJson = response.json();
      expect(responseJson).has.keys(['error', 'message'])
      expect(responseJson.error).is.null;
      expect(responseJson.message).has.key('attendance');
      expect(responseJson.message.attendance).has.keys(['year', 'month', 'total', 'highest', 'lowest', 'ignored']);
      expect(responseJson.message.attendance.year).is.equal(2014);
      expect(responseJson.message.attendance.month).is.equal("Jul");
      expect(responseJson.message.attendance.total).is.equal(28157);
      expect(responseJson.message.attendance.highest).has.keys(['museum', 'visitors']);
      expect(responseJson.message.attendance.highest.museum).is.equal("america_tropical_interpretive_center");
      expect(responseJson.message.attendance.highest.visitors).is.equal(13490);
      expect(responseJson.message.attendance.lowest).has.keys(['museum', 'visitors']);
      expect(responseJson.message.attendance.lowest.museum).is.equal("hellman_quon");
      expect(responseJson.message.attendance.lowest.visitors).is.equal(120);
      
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  });

  it(`checking for no timestamp and ignore param`, async () => {
    // the single test
    try {
      
      const response = await FastifyApp.fastifyServer.inject({
        method: 'get',
        url: '/api/visitors',
      });
      expect(response.statusMessage).equal('Unprocessable Entity');
      const responseJson = response.json();
      expect(responseJson).has.keys(['error', 'message'])
      expect(responseJson.message).is.null;
      expect(responseJson.error).is.equal("date parameter not valid");
      
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  });

  it(`checking for timestamp: abc and no ignore param`, async () => {
    // the single test
    try {
      
      const response = await FastifyApp.fastifyServer.inject({
        method: 'get',
        url: '/api/visitors',
        query: { date: 'abc', ignore: 'avila_adobe' }
      });
      expect(response.statusMessage).equal('Unprocessable Entity');
      const responseJson = response.json();
      expect(responseJson).has.keys(['error', 'message'])
      expect(responseJson.message).is.null;
      expect(responseJson.error).is.equal("date parameter not valid");
      
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  });

  it(`checking for timestamp: 1404198000000 and ignore: no_name param`, async () => {
    // the single test
    try {
      
      const response = await FastifyApp.fastifyServer.inject({
        method: 'get',
        url: '/api/visitors',
        query: { date: '1404198000000', ignore: 'no_name' }
      });
      expect(response.statusMessage).equal('OK');
      const responseJson = response.json();
      expect(responseJson).has.keys(['error', 'message'])
      expect(responseJson.error).is.null;
      expect(responseJson.message).has.key('attendance');
      expect(responseJson.message.attendance).has.keys(['year', 'month', 'total', 'highest', 'lowest']);
      expect(responseJson.message.attendance.year).is.equal(2014);
      expect(responseJson.message.attendance.month).is.equal("Jul");
      expect(responseJson.message.attendance.total).is.equal(60535);
      expect(responseJson.message.attendance.highest).has.keys(['museum', 'visitors']);
      expect(responseJson.message.attendance.highest.museum).is.equal("avila_adobe");
      expect(responseJson.message.attendance.highest.visitors).is.equal(32378);
      expect(responseJson.message.attendance.lowest).has.keys(['museum', 'visitors']);
      expect(responseJson.message.attendance.lowest.museum).is.equal("hellman_quon");
      expect(responseJson.message.attendance.lowest.visitors).is.equal(120);
      
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  });

  

  

  // it('checking Test get by id api', async () => {
  //   // the single test
  //   try {
  //     const response = await FastifyApp.fastifyServer.inject({
  //       method: 'GET',
  //       url: `/tests/${getTestId}`,
  //     });
  //     expect(response.statusMessage).equal('OK');
  //     expect(response.statusCode).equal(200);
  //   } catch (err) {
  //     console.log('err', err);
  //     throw err;
  //   }
  // });

  // it('checking Test update api', async () => {
  //   // the single test
  //   try {
  //     createTestPayload.tags = ['a', 'b'];
  //     const response = await FastifyApp.fastifyServer.inject({
  //       method: 'PUT',
  //       url: `/tests/${getTestId}`,
  //       payload: createTestPayload,
  //     });
  //     expect(response.statusMessage).equal('OK');
  //   } catch (err) {
  //     console.log('err', err);
  //     throw err;
  //   }
  // });

  // it('checking Test delete api', async () => {
  //   // the single test
  //   try {
  //     const response = await FastifyApp.fastifyServer.inject({
  //       method: 'DELETE',
  //       url: `/tests/${getTestId}`,
  //     });
  //     expect(response.statusMessage).equal('OK');
  //   } catch (err) {
  //     console.log('err', err);
  //     throw err;
  //   }
  // });
});
