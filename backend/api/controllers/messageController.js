const Message = require("../models/Message");
const { S3Client, newPutObjectCommand } = require("@aws-sdk/client-s3");
const uuid = require("uuid").v4;

const normalizeFilename = (filename) => {
  // we normalize filenames so when url is constructed we dont get different urls from that we have saved in our database
  filename = filename.replace(/[^\w\s.-]/g, "");
  filename = filename.replace(/\s+/g, "_");
  filename = filename.toLowerCase();

  return filename;
};

const s3Uploadv3 = async (files) => {
  const credentials = {
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
  };
  const s3client = new S3Client(credentials);

  const fileUrls = [];

  const responses = await Promise.all(
    files.map(async (file) => {
      const key = normalizeFilename(`${uuid()}-${file.originalname}`);
      const modifiedFile = {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: file.buffer,
      };

      try {
        const res = await s3client.send(new PutObjectCommand(modifiedFile));

        if (res.$metadata.httpStatusCode === 200) {
          const filename =
            "https://my-messenger1.s3.eu-central-1.amazonaws.com/" + key;
          fileUrls.push(filename);
          return res;
        }
      } catch (error) {}
    })
  );

  return { responses, fileUrls: fileUrls };
};

async function createMessage(req, res) {
  try {
    // const { body, authorId, conversationId, image } = req.body;
    // const {formData, }
    console.log("NEW MESSAGE: ", req.body.newMessage);
    console.log("FILES: ", req.files);

    //we will have body if message is text, and fileUrl if message is a file
    if ((!req.files && !body) || authorId || !conversationId) {
      return res.status(400).json({ message: "Invalid data" });
    }

    let message;

    if (body) {
      message = await Message.create({
        body,
        image,
        authorId,
        conversationId,
      });
    } else {
      const files = req.files;
      const { fileUrls } = await s3Uploadv3(files);

      console.log("got to uploading");

      message = await Message.create({
        fileUrls,
        image,
        authorId,
        conversationId,
      });
    }

    message = await message.populate("authorId");

    res.status(201).json(message);
  } catch (error) {
    console.log("GOT AN ERROR: ", error);
    res.status(400).json({ message: "Invalid data" });
  }
}

async function deleteMessage(req, res) {
  try {
    const { messageId } = req.body;

    if (!messageId) {
      return res.status(400).json({ message: "MessageId is required." });
    }

    const deletedMessage = await Message.findOneAndDelete({ _id: messageId });

    if (!deletedMessage) {
      return res
        .status(400)
        .json({ message: "Message with this id doesn't exist." });
    }

    res.status(200).json({
      message: "Succesfully removed the message",
      deletedMessage: deletedMessage,
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
  }
}

module.exports = { createMessage, deleteMessage };
