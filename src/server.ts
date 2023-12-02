import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  rest.get('https://api.dictionaryapi.dev/api/v2/entries/en/:word', (req, res, ctx) => {
 
    const { word } = req.params;

    if (word === 'invalidword') {
      return res(ctx.status(404));
    }

    return res(
      ctx.status(200),
      ctx.json([
        {
          word: word,
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

export const server = setupServer(...handlers)