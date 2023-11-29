import { rest } from 'msw'
import { setupServer } from 'msw/node'

export const handlers = [
  rest.get('https://api.dictionaryapi.dev/api/v2/entries/en/test', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          word: 'test',
          phonetics: [
            {
              text: '/tɛst/',
              audio: 'https://test.com/test.mp3',
            },
          ],
          origin: 'Origin of test',
          meanings: [
            {
              synonyms: ['trial', 'experiment'],
              antonyms: ['success', 'achievement'],
              partOfSpeech: 'noun',
              definitions: [
                {
                  definition: 'A procedure intended to establish...',
                  example: 'This is a test.',
                },
              ],
            },
          ],
        },
      ])
    )
  }),
  rest.get('https://api.dictionaryapi.dev/api/v2/entries/en/invalidword', (req, res, ctx) => {
    return res(ctx.status(404))
  }),
]

export const server = setupServer(...handlers)