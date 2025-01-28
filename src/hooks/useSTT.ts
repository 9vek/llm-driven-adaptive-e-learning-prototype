import useAPIClient from "./useAPIClient"

const client = useAPIClient()

export default async function useSTT(audioBlob: Blob) {
  const audioFile = new File([audioBlob], '_.wav', { type: 'audio/wav' })
  const resp = await client.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
  })
  return resp.text
}