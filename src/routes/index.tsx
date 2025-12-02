import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useAction, useMutation, useQuery } from 'convex/react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  // QUERY: Get the last 10 numbers from the database
  const response = useQuery(api.myFunctions.listNumbers, { count: 10 })

  // MUTATION: Add a new number to the database
  const addNumber = useMutation(api.myFunctions.addNumber)

  // ACTION: Call the myAction function
  const callMyAction = useAction(api.myFunctions.myAction)

  console.log(response)
  return (
    <main className="p-8 flex flex-col gap-16">
      <h1 className="text-4xl font-bold text-center">Welcome</h1>
      <p>Numbers: {response?.join(', ')}</p>
      <button
        onClick={() => addNumber({ value: Math.floor(Math.random() * 100) })}
      >
        Add Number
      </button>
      <button onClick={() => callMyAction()}>Call Action</button>
    </main>
  )
}
