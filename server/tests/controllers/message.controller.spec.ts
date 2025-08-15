import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../../app';
import * as util from '../../services/message.service';

const saveMessageSpy = jest.spyOn(util, 'saveMessage');
const getMessagesSpy = jest.spyOn(util, 'getMessages');

describe('POST /addMessage', () => {
  it('should add a new message', async () => {
    const validId = new mongoose.Types.ObjectId();
    const message = {
      _id: validId,
      msg: 'Hello',
      msgFrom: 'User1',
      msgDateTime: new Date('2024-06-04'),
    };

    saveMessageSpy.mockResolvedValue(message);

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: message });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: message._id.toString(),
      msg: message.msg,
      msgFrom: message.msgFrom,
      msgDateTime: message.msgDateTime.toISOString(),
    });
  });

  it('should return bad request error if messageToAdd is missing', async () => {
    const response = await supertest(app).post('/messaging/addMessage').send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  // TODO: Task 2 - Write additional test cases for addMessageRoute
  it('should return internal server error if saveMessage fails', async () => {
    const validId = new mongoose.Types.ObjectId();
    const message = {
      _id: validId,
      msg: 'Hello There!',
      msgFrom: 'sameer1306',
      msgDateTime: new Date('2025-08-15'),
    };

    saveMessageSpy.mockResolvedValue({ error: 'Error saving document' });

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: message });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding a message: Error saving document');
  });

  it('should return internal server error if an unexpected error occurs', async () => {
    const validId = new mongoose.Types.ObjectId();
    const message = {
      _id: validId,
      msg: 'Hello There!',
      msgFrom: 'sameer1306',
      msgDateTime: new Date('2025-08-15'),
    };

    saveMessageSpy.mockRejectedValue(new Error('Unexpected error'));

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: message });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding a message: Unexpected error');
  });

  it('should return bad message body error if msg is empty', async () => {
    const badMessage = {
      msg: '',
      msgFrom: 'sameer1306',
      msgDateTime: new Date('2025-08-15'),
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: badMessage });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message body');
  });

  it('should return bad message body error if msg is missing', async () => {
    const badMessage = {
      msgFrom: 'sameer1306',
      msgDateTime: new Date('2025-08-15'),
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: badMessage });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message body');
  });

  it('should return bad message body error if msgFrom is empty', async () => {
    const badMessage = {
      msg: 'Hello There!',
      msgFrom: '',
      msgDateTime: new Date('2025-08-15'),
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: badMessage });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message body');
  });

  it('should return bad message body error if msgFrom is missing', async () => {
    const badMessage = {
      msg: 'Hello There!',
      msgDateTime: new Date('2025-08-15'),
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: badMessage });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message body');
  });

  it('should return bad message body error if msgDateTime is null', async () => {
    const badMessage = {
      msg: 'Hello There!',
      msgFrom: 'sameer1306',
      msgDateTime: null,
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: badMessage });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message body');
  });

  it('should return bad message body error if msgDateTime is missing', async () => {
    const badMessage = {
      msg: 'Hello There!',
      msgFrom: 'sameer1306',
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: badMessage });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message body');
  });
});

describe('GET /getMessages', () => {
  it('should return all messages', async () => {
    const message1 = {
      msg: 'Hello',
      msgFrom: 'User1',
      msgDateTime: new Date('2024-06-04'),
    };

    const message2 = {
      msg: 'Hi',
      msgFrom: 'User2',
      msgDateTime: new Date('2024-06-05'),
    };

    getMessagesSpy.mockResolvedValue([message1, message2]);

    const response = await supertest(app).get('/messaging/getMessages');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        msg: message1.msg,
        msgFrom: message1.msgFrom,
        msgDateTime: message1.msgDateTime.toISOString(),
      },
      {
        msg: message2.msg,
        msgFrom: message2.msgFrom,
        msgDateTime: message2.msgDateTime.toISOString(),
      },
    ]);
  });

  it('should return server error if getMessages throws an exception', async () => {
    getMessagesSpy.mockRejectedValue(new Error('Database error'));
    const response = await supertest(app).get('/messaging/getMessages');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Database error' });
  });
});
