import MainView from '@/components/MainView'

//AEOUTRY IHL_
// ["A","E","O","I","R","H","L","T","U","Y"," "]


export default function page() {
  return (
    <MainView DATA={["A loyal turtle",
      "You are loyal",
      "The quiet air",
      "You are truley a hero"]} redirectLink="/?step=3" />
  )
}
