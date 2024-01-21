import MainView from '@/components/MainView'

export default function Page() {
  return (
    <MainView DATA={["Rail", "The outer hill", "Early hearty earth"
    ]} redirectLink="/?step=5" testMode={true} />
  )
}
