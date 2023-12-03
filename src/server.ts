import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  rest.get('https://api.dictionaryapi.dev/api/v2/entries/en/:word', (req, res, ctx) => {
 
  // Extract the "word" parameter from the request URL
    const { word } = req.params;

     // If the requested word is "invalidword", respond with a 404 status
    if (word === 'invalidword') {
      return res(ctx.status(404));
    }

    // Otherwise, respond with a 200 status and a JSON object containing word data
    return res(
      ctx.status(200),
      ctx.json([
        {
          word: word,
          sourceUrls: 'https://sourceUrl.com/' + word,
          phonetics: [
            {
              text: '/tɛst/',
              audio: 'https://test.com/test.mp3',
            },
          ],
          origin: 'Origin of ' + word,
          meanings: [
            {
              synonyms: ['trial', 'experiment'],
              antonyms: ['success', 'achievement'],
              partOfSpeech: 'noun',
              definitions: [
                {
                  definition: 'A procedure intended to establish...',
                  example: 'This is a ' + word + '.',
                },
              ],
            },
          ],
        },
      ])
    )
  }),
]

// Create a mock server using the handlers defined above
export const server = setupServer(...handlers)