import MainView from '@/components/MainView'

export default function page() {
  return (
    <MainView DATA={["HELLO", "THREE", "HIRE"]} redirectLink="/?step=3" />
  )
}
