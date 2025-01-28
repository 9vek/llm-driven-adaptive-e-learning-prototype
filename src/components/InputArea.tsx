import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch, store } from "../store"
import {
  selectStatus,
  selectAudioURL,
  updateStatus,
  updateTextAndAudioURL,
} from "../slices/InputAreaSlice"
import useSTT from '../hooks/useSTT'
import { selectBgColor, selectFontSize, selectTextColor } from '../slices/ThemeSlice'
import { useAgent } from '../slices/AgentSlice'
import { MicrophoneIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { useLocation, useNavigate } from 'react-router-dom'
import loadingSound from '../assets/loading-sound.mp3'

const audioElement = new Audio()
const loadingSoundPlayer = new Audio(loadingSound)
loadingSoundPlayer.volume = 0.2
const playLoadingSound = () => {
  loadingSoundPlayer.play()
}
let internalId: NodeJS.Timeout | null
const startPlayLoadingSound = () => {
  internalId = setInterval(playLoadingSound, 1000)
}
const stopPlayLoadingSound = () => {
  if (internalId != null) {
    clearInterval(internalId)
    internalId = null
  }
}
const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
const mediaRecorder = new MediaRecorder(stream)

export default function InputArea() {

  const bgColor = useAppSelector(selectBgColor)
  const textColor = useAppSelector(selectTextColor)
  const fontSize = useAppSelector(selectFontSize)
  const [textInput, setTextInput] = useState('')
  const [isFocusOnTextInput, setIsFocusOnTextInput] = useState(false)

  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const location = useLocation()

  const status = useAppSelector(selectStatus)
  const audioURL = useAppSelector(selectAudioURL)
  let inputAudioBlob: Blob | null = null
  let inputAudioChunks: Blob[] = []

  const getVoiceButtonStyle = () => {
    if (status == 'uninitialized') {
      return 'bg-stone-400'
    }
    else if (status == 'inactivated') {
      return 'bg-stone-600'
    }
    else if (status == 'idle') {
      return 'bg-lime-600'
    }
    else if (status == 'playing') {
      return 'bg-amber-400'
    }
    else if (status == 'recording') {
      return 'bg-rose-600'
    }
    else if (status == 'loading') {
      return 'bg-violet-600'
    }
    else {
      return ''
    }
  }

  const getSendButtonStyle = () => {
    if (status == 'playing') {
      return 'bg-amber-400'
    }
    else if (status == 'loading') {
      return 'bg-violet-600'
    }
    else {
      return ' bg-lime-600'
    }
  }

  useEffect(() => {
    if (status == 'idle' || status == 'loading') {
      audioElement.src = audioURL
      audioElement.load()
      audioElement.play()
    }
  }, [audioURL])

  const submitTextInput = async () => {
    if (status != 'inactivated' && status != 'uninitialized') {
      dispatch(updateStatus('loading'))
    }
    const textInputBuffer = textInput
    setTextInput('')
    const agentMessage = await dispatch(useAgent({ userMessage: textInputBuffer, nav, location }))
    dispatch(updateTextAndAudioURL(agentMessage.payload as string))
  }

  const handleVoiceMsg = async () => {
    dispatch(updateStatus('loading'))
    const transcription = await useSTT(inputAudioBlob as Blob)
    const agentMessage = await dispatch(useAgent({ userMessage: transcription, nav, location }))
    dispatch(updateTextAndAudioURL(agentMessage.payload as string))
  }

  const onEnterVoiceButton = async () => {
    if (status == 'idle') {
      audioElement.src = audioURL
      audioElement.load()
      audioElement.play()
    }
    else {
      return
    }
  }

  const onClickVoiceButton = async () => {
    if (status == 'inactivated') {
      dispatch(updateStatus('idle'))
      audioElement.src = audioURL
      audioElement.load()
      audioElement.play()
    }
    else if (status == 'idle') {
      mediaRecorder.start()
    }
    else if (status == 'playing') {
      audioElement.pause()
    }
    else if (status == 'recording') {
      mediaRecorder.stop()
    }
    else if (status == 'loading') {
      dispatch(updateStatus('idle'))
    }
  }

  const voiceInteractionShortCutKeyHandler = async (event: { code: string }) => {
    if (isFocusOnTextInput) return
    else if (event.code === 'Space') {
      await onClickVoiceButton()
    }
    else if (event.code === 'KeyV' ) {
      await onEnterVoiceButton()
    }
  }

  useEffect(() => {
    audioElement.addEventListener('play', () => {
      dispatch(updateStatus('playing'))
    });
    audioElement.addEventListener('ended', () => {
      dispatch(updateStatus('idle'))
    });
    audioElement.addEventListener('pause', () => {
      dispatch(updateStatus('idle'))
    })
    mediaRecorder.onstart = (_) => {
      dispatch(updateStatus('recording'))
    };
    mediaRecorder.ondataavailable = (event) => {
      inputAudioChunks.push(event.data)
    };
    mediaRecorder.onstop = (_) => {
      inputAudioBlob = new Blob(inputAudioChunks, { type: 'audio/wav' })
      inputAudioChunks = []
      handleVoiceMsg()
    };
  }, [])

  useEffect(() => {
    window.addEventListener('keyup', voiceInteractionShortCutKeyHandler);
    return () => {
      window.removeEventListener('keyup', voiceInteractionShortCutKeyHandler);
    }
  }, [status, isFocusOnTextInput])

  useEffect(() => {
    if (status == 'loading') {
      startPlayLoadingSound()
    } else {
      stopPlayLoadingSound()
    }
  }, [status])

  return (
    <div className='flex flex-col gap-y-2 p-2 w-full'>
      <div className='flex gap-x-2 h-32 w-full'>
        <textarea onFocus={() => setIsFocusOnTextInput(true)} onBlur={() => setIsFocusOnTextInput(false)} value={textInput} onChange={(event) => setTextInput(event.target.value)} className={`${bgColor.bgLv1} ${textColor.textLv1} rounded-xl outline-none w-full h-32 border border-stone-800 p-2`}></textarea>
        <div onClick={submitTextInput} className={`w-[30%] h-full ${getSendButtonStyle()} grid grid-cols-1 place-items-center rounded-3xl`}>
          <PaperAirplaneIcon className={`size-12 text-white`} />
        </div>
      </div>
      <div onMouseEnter={onEnterVoiceButton} onClick={onClickVoiceButton} className={`mx-auto rounded-3xl shadow-2xl cursor-pointer grid grid-cols-1 place-items-center text-white font-bold h-32 w-full ${getVoiceButtonStyle()} transition-all`}>
        <MicrophoneIcon className='size-12' />
      </div>
      <div />
    </div>
  )
}
