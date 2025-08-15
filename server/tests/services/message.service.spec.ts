import MessageModel from '../../models/messages.model';
import { getMessages, saveMessage } from '../../services/message.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

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

describe('Message model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('saveMessage', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the saved message', async () => {
      mockingoose(MessageModel).toReturn(message1, 'create');

      const savedMessage = await saveMessage(message1);

      expect(savedMessage).toMatchObject(message1);
    });
    // TODO: Task 2 - Write a test case for saveMessage when an error occurs
    it('should throw an error if error occurs when saving to database', async () => {
      jest
        .spyOn(MessageModel, 'create')
        .mockRejectedValueOnce(() => new Error('Error saving document'));

      const saveError = await saveMessage(message1);

      expect('error' in saveError).toBe(true);
    });
  });

  describe('getMessages', () => {
    it('should return all messages, sorted by date', async () => {
      mockingoose(MessageModel).toReturn([message2, message1], 'find');

      const messages = await getMessages();

      expect(messages).toMatchObject([message1, message2]);
    });
    // TODO: Task 2 - Write a test case for getMessages when an error occurs
    it('should return an empty array if error when retrieving messages', async () => {
      jest
        .spyOn(MessageModel, 'find')
        .mockRejectedValueOnce(new Error('Error retrieving documents'));

      const messages = await getMessages();

      expect(messages).toEqual([]);
    });
  });
});
