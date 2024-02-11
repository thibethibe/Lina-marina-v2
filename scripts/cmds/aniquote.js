const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');

module.exports = {
  config: {
    name: "aniquote",
    aliases: [],
    version: "1.2",
    author: "Shikaki",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Display a random quote"
    },
    longDescription: {
      en: "Display a random quote for you."
    },
    category: "😄Fun",
    guide: {
      en: "   {pn} aniquote"
    }
  },

  onStart: async function ({ message, getLang }) {
    try {
      // Define the anime/quote API endpoint
      const apiEndpoint = "https://rishadsapi.apis100.repl.co/anime/quote";

      // Fetch data from the anime/quote API
      const response = await axios.get(apiEndpoint);
      const responseData = response.data;

      if (responseData && responseData.quote) {
        const imageUrl = responseData.quote;

        // Specify the absolute path for the image file
        const imageFileName = 'quote_image.jpg';
        const imageFilePath = path.join(__dirname, imageFileName);

        const file = fs.createWriteStream(imageFilePath);
        const request = https.get(imageUrl, function (response) {
          response.pipe(file);
          file.on('finish', function () {
            // Send the image as an attachment along with the text
            message.reply({
              body: `✨🌟✨Ani quote✨🌟✨`,
              attachment: fs.createReadStream(imageFilePath)
            });

            // Close the file stream
            file.close();
          });
        });
      } else {
        message.reply(`✨🌟✨\n${getLang("quote", "Unable to fetch the quote or image.")}\n✨🌟✨`);
      }
    } catch (error) {
      console.error("Error fetching or processing aniquote:", error.message);
      message.reply(`✨🌟✨\n${getLang("quote", "An error occurred while fetching the aniquote.")}\n✨🌟✨`);
    }
  }
};
