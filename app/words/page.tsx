import MainView from '@/components/MainView'

export default function page() {
  return (
    <MainView DATA={["Hello", "Three", "Hire"]} redirectLink="/?step=3" />
  )
}
