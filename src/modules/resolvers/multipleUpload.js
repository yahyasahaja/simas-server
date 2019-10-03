import promisesAll from 'promises-all'

import { processUpload } from '../../utils'

export default async (obj, { files }) => {
  const { resolve, reject } = await promisesAll.all(
    files.map(processUpload)
  )

  if (reject.length)
    reject.forEach(({ name, message }) =>
      // eslint-disable-next-line no-console
      console.error(`${name}: ${message}`)
    )

  return resolve
}