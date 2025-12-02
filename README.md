# Convex Crash Course

A learning project exploring Convex - a real-time backend platform for building modern applications.

## What is Convex?

Convex is a full-stack development platform that provides:
- Real-time database with automatic syncing
- Serverless functions (queries, mutations, actions)
- TypeScript-first development experience
- Automatic caching and optimistic updates

## Tech Stack

- **Frontend**: React with TanStack Router
- **Backend**: Convex
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Key Learnings

### 1. Schema Definition (`convex/schema.ts`)

Define your database schema with TypeScript validators for type safety:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),
});
```

**Key points:**
- Schema is optional but provides precise TypeScript types
- Use `defineSchema` and `defineTable` from `convex/server`
- Use validators from `convex/values` (e.g., `v.number()`, `v.string()`)
- System fields `_id` and `_creationTime` are automatically added to all documents

### 2. Queries (`query`)

Queries are used to **read data** from the database:

```typescript
export const listNumbers = query({
  args: {
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const numbers = await ctx.db
      .query('numbers')
      .order('desc')
      .take(args.count)
    return numbers.reverse().map((number) => number.value)
  },
})
```

**Key points:**
- Queries are read-only and automatically cached
- Use `ctx.db.query('tableName')` to start a query
- Chain methods like `.order('desc')`, `.take(n)`, `.collect()`
- Default ordering is ascending by `_creationTime`

### 3. Mutations (`mutation`)

Mutations are used to **write data** to the database:

```typescript
export const addNumber = mutation({
  args: {
    value: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('numbers', { value: args.value })
    console.log('Added new document with id:', id)
    return id;
  },
})
```

**Key points:**
- Mutations can read AND write to the database
- Use `ctx.db.insert(tableName, document)` to add documents
- Mutations are transactional
- Can return values to the client

### 4. Actions (`action`)

Actions are used to interact with **external APIs** and services:

```typescript
export const myAction = action({
  args: {},
  handler: async (ctx) => {
    // Fetch from external API
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    
    // Call a mutation to save data
    await ctx.runMutation(api.myFunctions.addNumber, {
      value: data[0],
    })
  },
})
```

**Key points:**
- Actions **cannot** directly access the database (`ctx.db` not available)
- Use `ctx.runQuery()` and `ctx.runMutation()` to interact with the database
- Perfect for third-party API calls, file processing, etc.
- Use `api` object to reference other functions

### 5. Using Convex in React

Convex provides React hooks for seamless integration:

```tsx
import { api } from 'convex/_generated/api'
import { useAction, useMutation, useQuery } from 'convex/react'

function Home() {
  // Query: Real-time data subscription
  const numbers = useQuery(api.myFunctions.listNumbers, { count: 10 })

  // Mutation: Write data
  const addNumber = useMutation(api.myFunctions.addNumber)

  // Action: Call server actions
  const callMyAction = useAction(api.myFunctions.myAction)

  return (
    <div>
      <p>Numbers: {numbers?.join(', ')}</p>
      <button onClick={() => addNumber({ value: 42 })}>
        Add Number
      </button>
      <button onClick={() => callMyAction()}>
        Fetch from API
      </button>
    </div>
  )
}
```

**Key points:**
- `useQuery` - Subscribe to real-time data (auto-updates when data changes!)
- `useMutation` - Trigger database writes
- `useAction` - Call server actions
- All hooks use the auto-generated `api` object for type-safe function references

## Project Structure

```
├── convex/
│   ├── _generated/      # Auto-generated types and API
│   ├── myFunctions.ts   # Convex functions (queries, mutations, actions)
│   ├── schema.ts        # Database schema
│   └── README.md        # Convex-specific docs
├── src/
│   ├── routes/          # TanStack Router routes
│   │   └── index.tsx    # Home page with Convex integration
│   └── styles/
│       └── app.css      # Tailwind CSS styles
└── package.json
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Convex dev server:
   ```bash
   npx convex dev
   ```

3. Start the frontend:
   ```bash
   npm run dev
   ```

## Resources

- [Convex Documentation](https://docs.convex.dev)
- [Convex Functions Guide](https://docs.convex.dev/functions)
- [Convex Database Guide](https://docs.convex.dev/database)
- [TanStack Router](https://tanstack.com/router)

