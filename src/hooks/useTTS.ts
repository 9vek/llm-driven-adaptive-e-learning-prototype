import useAPIClient from "./useAPIClient"

const client = useAPIClient()

export default async function useTTS(text: string) {
  const resp = await client.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text
  })
  const blob = new Blob([await resp.arrayBuffer()], { type: 'audio/mp3' });
  const audioUrl = URL.createObjectURL(blob)
  return audioUrl
}