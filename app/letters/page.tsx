import MainView from '@/components/MainView'

export default function page() {
  return (
    <MainView DATA={["A","E","O","R","L","T","U"]} redirectLink="/home?step=2" />
  )
}
