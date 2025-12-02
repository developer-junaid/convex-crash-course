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
    <main className="p-8 flex flex-col gap-10">
      <h1 className="text-4xl font-bold text-center">Convex Crash Course</h1>
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center">
        <p>Latest 10 Numbers from the DB</p>
        <p>{response?.join(', ')}</p>
      </div>

      <div className="flex flex-col gap-4 max-w-sm mx-auto">
        <button
          className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2 cursor-pointer"
          onClick={() => addNumber({ value: Math.floor(Math.random() * 100) })}
        >
          Add Random Number
        </button>

        <button
          className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2 cursor-pointer"
          onClick={() => callMyAction()}
        >
          Call Action to Add Random Number
        </button>
      </div>
    </main>
  )
}
