const nowDate = new Date();

const messageData = [
  {
    id: "1",
    usersId: ["0", "1"],
    messages: [
      {
        uid: "0",
        message: "hello",
        dateTime: nowDate,
      },
      {
        uid: "1",
        message: "yo",
        dateTime: nowDate,
      },
      {
        uid: "0",
        message: "how's life?",
        dateTime: nowDate,
      },
      {
        uid: "1",
        message: "great!",
        dateTime: nowDate,
      },
    ],
  },
  {
    id: "2",
    usersId: ["0", "2"],
    messages: [
      {
        uid: "0",
        message: "hello",
        dateTime: nowDate,
      },
      {
        uid: "2",
        message: "yo",
        dateTime: nowDate,
      },
      {
        uid: "0",
        message: "how's life?",
        dateTime: nowDate,
      },
      {
        uid: "2",
        message: "great!",
        dateTime: nowDate,
      },
    ],
  },
];

export default messageData;
